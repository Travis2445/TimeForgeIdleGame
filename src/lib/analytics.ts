import { supabase } from './supabase';

export type AnalyticsEvent =
  | 'run_start'
  | 'collapse'
  | 'stage_reached'
  | 'trait_selected'
  | 'meta_upgrade_purchased'
  | 'achievement_unlocked';

export async function trackEvent(
  eventType: AnalyticsEvent,
  payload: Record<string, any> = {}
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('game_events').insert({
      user_id: user?.id || null,
      event_type: eventType,
      event_payload: payload,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
