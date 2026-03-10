import { supabase } from '@/integrations/supabase/client';
import { getAdminToken } from '@/services/adminAuthService';
import type { RouteStep, ReferenceArticle, LocalResource, ContactPoint, Bundle, FallbackContent } from '@/types';

export type ContentData = RouteStep | ReferenceArticle | LocalResource | ContactPoint | Bundle | FallbackContent | Record<string, unknown>;

export interface ContentItem {
  id: string;
  content_type: string;
  category: string | null;
  data: ContentData;
  updated_at: string;
}

export interface ContentRelation {
  id: string;
  parent_id: string;
  child_id: string;
  relation_type: string;
  position: number;
}

async function invoke(action: string, params: Record<string, unknown> = {}) {
  const token = getAdminToken();
  if (!token) throw new Error('Not authenticated');

  const { data, error } = await supabase.functions.invoke('admin-content', {
    body: { token, action, ...params },
  });

  if (error) throw new Error(error.message || 'Request failed');
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function listContentItems(contentType?: string, search?: string, category?: string): Promise<ContentItem[]> {
  const params: Record<string, unknown> = {};
  if (contentType) params.content_type = contentType;
  if (search) params.search = search;
  if (category) params.category = category;
  const result = await invoke('list', params);
  return result.data || [];
}

export async function getContentItem(id: string): Promise<ContentItem> {
  const result = await invoke('get', { id });
  return result.data;
}

export async function updateContentItem(id: string, data: ContentData, category?: string | null): Promise<ContentItem> {
  const result = await invoke('update', { id, data, category });
  return result.data;
}

export async function createContentItem(id: string, contentType: string, data: ContentData, category?: string | null): Promise<ContentItem> {
  const result = await invoke('create', { id, content_type: contentType, data, category });
  return result.data;
}

export async function seedContentItems(items: { id: string; content_type: string; data: ContentData }[]): Promise<void> {
  await invoke('seed', { items });
}

// --- Content Relations ---

export async function listContentRelations(parentId: string): Promise<ContentRelation[]> {
  const result = await invoke('list_relations', { parent_id: parentId });
  return result.data || [];
}

export async function setContentRelations(parentId: string, childIds: string[], relationType: string = 'bundle_step'): Promise<void> {
  await invoke('set_relations', { parent_id: parentId, child_ids: childIds, relation_type: relationType });
}
