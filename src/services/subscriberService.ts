import { supabase } from "@/integrations/supabase/client";

interface SubscriberData {
  email: string;
  consent: boolean;
  language: string;
  municipality: string | null;
  scenario: string | null;
}

/**
 * Upsert a subscriber record via secure RPC function.
 */
export async function saveSubscriber(data: SubscriberData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('upsert_subscriber', {
      p_email: data.email.toLowerCase().trim(),
      p_consent_status: data.consent,
      p_language: data.language,
      p_municipality: data.municipality,
      p_scenario: data.scenario,
    });

    if (error) {
      console.error('Subscriber save error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Subscriber save unexpected error:', err);
    return { success: false, error: 'Unexpected error' };
  }
}

/**
 * Delete a subscriber record by email (for future unsubscribe).
 */
export async function deleteSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('delete_subscriber', {
      p_email: email.toLowerCase().trim(),
    });
    if (error) {
      console.error('Subscriber delete error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Subscriber delete unexpected error:', err);
    return { success: false, error: 'Unexpected error' };
  }
}
