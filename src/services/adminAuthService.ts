import { supabase } from '@/integrations/supabase/client';

const TOKEN_KEY = 'dia-admin-token';

export async function adminLogin(login: string, password: string): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('admin-login', {
    body: { login, password },
  });

  if (error || !data?.token) {
    return { success: false, error: data?.error || 'Invalid credentials' };
  }

  sessionStorage.setItem(TOKEN_KEY, data.token);
  return { success: true };
}

export async function adminVerify(): Promise<boolean> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return false;

  try {
    const { data, error } = await supabase.functions.invoke('admin-verify', {
      body: { token },
    });
    if (error || !data?.valid) {
      sessionStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function adminLogout() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
