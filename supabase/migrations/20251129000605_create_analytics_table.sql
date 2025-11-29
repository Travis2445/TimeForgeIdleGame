/*
  # Analytics Events Table

  1. New Table
    - `game_events`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable, references auth.users)
      - `event_type` (text) - e.g., "run_start", "collapse", "stage_reached"
      - `event_payload` (jsonb) - flexible event data
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow authenticated users to insert their own events
    - Allow service role to read all events (for analytics)

  3. Indexes
    - Index on user_id for filtering
    - Index on event_type for queries
    - Index on created_at for time-based queries
*/

CREATE TABLE IF NOT EXISTS game_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_game_events_user_id ON game_events(user_id);
CREATE INDEX IF NOT EXISTS idx_game_events_type ON game_events(event_type);
CREATE INDEX IF NOT EXISTS idx_game_events_created_at ON game_events(created_at DESC);

ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own events"
  ON game_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can read all events"
  ON game_events FOR SELECT
  TO service_role
  USING (true);