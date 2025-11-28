/*
  # TimeForge Database Schema

  1. New Tables
    - `game_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `display_name` (text)
      - `created_at` (timestamptz)
      - `last_seen_at` (timestamptz)
      - `total_echoes_earned` (bigint) - lifetime Echo Crystals earned
      - `highest_run_power` (bigint) - best Flux production achieved in any run

    - `game_saves`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `slot` (integer) - save slot number (default 1 for MVP)
      - `state_json` (jsonb) - complete game state
      - `version` (integer) - game version for migrations
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only read/write their own game data
    - Authenticated users only

  3. Indexes
    - Index on user_id for fast lookups
    - Index on updated_at for tracking active players
*/

-- Create game_profiles table
CREATE TABLE IF NOT EXISTS game_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name text NOT NULL DEFAULT 'Cosmic Forger',
  created_at timestamptz DEFAULT now() NOT NULL,
  last_seen_at timestamptz DEFAULT now() NOT NULL,
  total_echoes_earned bigint DEFAULT 0 NOT NULL,
  highest_run_power bigint DEFAULT 0 NOT NULL
);

-- Create game_saves table
CREATE TABLE IF NOT EXISTS game_saves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slot integer DEFAULT 1 NOT NULL,
  state_json jsonb NOT NULL,
  version integer DEFAULT 1 NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, slot)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_profiles_user_id ON game_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_game_profiles_last_seen ON game_profiles(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_profiles
CREATE POLICY "Users can view own profile"
  ON game_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON game_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON game_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON game_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for game_saves
CREATE POLICY "Users can view own saves"
  ON game_saves FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saves"
  ON game_saves FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saves"
  ON game_saves FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saves"
  ON game_saves FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);