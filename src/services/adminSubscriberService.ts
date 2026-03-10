import { supabase } from '@/integrations/supabase/client';
import { getAdminToken } from '@/services/adminAuthService';

interface Subscriber {
  id: string;
  email: string;
  consent_status: boolean;
  language: string;
  municipality: string | null;
  scenario: string | null;
  created_at: string;
  updated_at: string;
}

interface ListParams {
  search?: string;
  language?: string;
  municipality?: string;
  scenario?: string;
  consent?: boolean | null;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

interface ListResult {
  data: Subscriber[];
  total: number;
}

async function invoke(action: string, params: Record<string, unknown> = {}) {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('admin-subscribers', {
    body: { token, action, ...params },
  });

  if (error) throw new Error(error.message || 'Request failed');
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function listSubscribers(params: ListParams): Promise<ListResult> {
  const result = await invoke('list', params as Record<string, unknown>);
  return { data: result.data || [], total: result.total ?? 0 };
}

export async function getSubscriber(id: string): Promise<Subscriber> {
  const result = await invoke('get', { id });
  return result.data;
}

export async function updateSubscriber(id: string, updates: Partial<Subscriber>): Promise<Subscriber> {
  const result = await invoke('update', { id, updates });
  return result.data;
}

export async function deleteSubscriber(id: string): Promise<void> {
  await invoke('delete', { id });
}

export type { Subscriber, ListParams, ListResult };
