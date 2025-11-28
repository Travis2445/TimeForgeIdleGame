import { supabase } from './supabase';
import { GameState, GameProfile } from '../types/game';
import { createInitialState, calculateEchoesFromRun } from '../game/logic';

const SAVE_SLOT = 1;

export async function loadGameSave(): Promise<GameState | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('game_saves')
      .select('state_json')
      .eq('user_id', user.id)
      .eq('slot', SAVE_SLOT)
      .maybeSingle();

    if (error) {
      console.error('Error loading save:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data.state_json as GameState;
  } catch (error) {
    console.error('Failed to load game save:', error);
    return null;
  }
}

export async function saveGameState(state: GameState): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return false;
    }

    const { error } = await supabase
      .from('game_saves')
      .upsert({
        user_id: user.id,
        slot: SAVE_SLOT,
        state_json: state,
        version: state.version,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,slot'
      });

    if (error) {
      console.error('Error saving game:', error);
      return false;
    }

    await supabase
      .from('game_profiles')
      .upsert({
        user_id: user.id,
        last_seen_at: new Date().toISOString(),
        total_echoes_earned: state.totalEchoesEver,
        highest_run_power: Math.max(state.flux, 0),
      }, {
        onConflict: 'user_id'
      });

    return true;
  } catch (error) {
    console.error('Failed to save game state:', error);
    return false;
  }
}

export async function collapseUniverse(state: GameState): Promise<GameState> {
  try {
    const echoesEarned = calculateEchoesFromRun(state);

    const newState: GameState = {
      ...createInitialState(),
      echoes: state.echoes + echoesEarned,
      totalEchoesEver: state.totalEchoesEver + echoesEarned,
      shards: state.shards,
      runNumber: state.runNumber + 1,
      discoveredTraits: state.discoveredTraits,
      achievements: state.achievements,
      soundOn: state.soundOn,
      autoSaveEnabled: state.autoSaveEnabled,
    };

    Object.keys(state.upgrades).forEach((upgradeId) => {
      const upgrade = state.upgrades[upgradeId];
      if (upgrade.costCurrency === 'echoes' && upgrade.purchased) {
        newState.upgrades[upgradeId] = {
          ...newState.upgrades[upgradeId],
          purchased: true,
        };
      }
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from('game_profiles')
        .upsert({
          user_id: user.id,
          total_echoes_earned: newState.totalEchoesEver,
          highest_run_power: Math.max(state.flux, 0),
          last_seen_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      await saveGameState(newState);
    }

    return newState;
  } catch (error) {
    console.error('Failed to collapse universe:', error);
    throw error;
  }
}

export async function getGameProfile(): Promise<GameProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('game_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return null;
    }

    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('game_profiles')
        .insert({
          user_id: user.id,
          display_name: 'Cosmic Forger',
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return null;
      }

      return newProfile as GameProfile;
    }

    return data as GameProfile;
  } catch (error) {
    console.error('Failed to get game profile:', error);
    return null;
  }
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
