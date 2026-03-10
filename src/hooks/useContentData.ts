import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { articles as staticArticles } from '@/data/articles';
import { routeSteps as staticRouteSteps } from '@/data/routeSteps';
import { resources as staticResources } from '@/data/resources';
import { contacts as staticContacts } from '@/data/contacts';
import { fallbackContent as staticFallback } from '@/data/fallbackContent';
import { scenarios as staticScenarios } from '@/data/scenarios';
import { ReferenceArticle, RouteStep, LocalResource, ContactPoint, FallbackContent, Bundle } from '@/types';
import type { ContentData } from '@/services/adminContentService';

async function fetchContentItems(contentType: string, category?: string) {
  let query = supabase
    .from('content_items')
    .select('id, content_type, category, data')
    .eq('content_type', contentType);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Fetch content_relations for a set of parent IDs
async function fetchContentRelations(parentIds: string[]) {
  if (parentIds.length === 0) return [];
  const { data, error } = await supabase
    .from('content_relations')
    .select('parent_id, child_id, position, relation_type')
    .in('parent_id', parentIds)
    .order('position', { ascending: true });
  if (error) throw error;
  return data || [];
}

export function useArticles(category?: string): ReferenceArticle[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'article', category],
    queryFn: () => fetchContentItems('article', category),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => item.data as unknown as ReferenceArticle);
  }

  if (category) {
    return staticArticles.filter(a => a.categoryId === category);
  }
  return staticArticles;
}

export function useRouteSteps(category?: string): RouteStep[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'route_step', category],
    queryFn: () => fetchContentItems('route_step', category),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => item.data as unknown as RouteStep);
  }

  if (category) {
    return staticRouteSteps.filter(s => s.categoryId === category);
  }
  return staticRouteSteps;
}

export function useResources(category?: string): LocalResource[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'local_resource', category],
    queryFn: () => fetchContentItems('local_resource', category),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => item.data as unknown as LocalResource);
  }

  if (category) {
    return staticResources.filter(r => r.categoryId === category);
  }
  return staticResources;
}

export function useContacts(category?: string): ContactPoint[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'contact_point', category],
    queryFn: () => fetchContentItems('contact_point', category),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => item.data as unknown as ContactPoint);
  }

  if (category) {
    return staticContacts.filter(c => c.categoryId === category);
  }
  return staticContacts;
}

export function useFallbackContent(category?: string): FallbackContent[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'fallback_content', category],
    queryFn: () => fetchContentItems('fallback_content', category),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => item.data as unknown as FallbackContent);
  }

  if (category) {
    return staticFallback.filter(f => f.categoryId === category);
  }
  return staticFallback;
}

/**
 * Fetch all bundles (step_bundle + guide_card) from content_items.
 * Falls back to generating synthetic bundles from static scenarios.
 */
export function useBundles(): Bundle[] {
  const { data } = useQuery({
    queryKey: ['content_items', 'bundles_all'],
    queryFn: async () => {
      const [bundles, guideCards] = await Promise.all([
        fetchContentItems('step_bundle'),
        fetchContentItems('guide_card'),
      ]);
      return [...(bundles || []), ...(guideCards || [])];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (data && data.length > 0) {
    return data.map((item) => {
      const d = item.data as ContentData;
      return {
        id: item.id,
        bundleType: d.bundleType || (d.useInOnboarding ? 'onboarding' : 'guide'),
        name: d.name || d.title || {},
        description: d.description || d.summary || {},
        icon: d.icon,
        priority: d.priority ?? d.defaultOrder,
        useInOnboarding: d.useInOnboarding ?? false,
        visibilityInLibrary: d.visibilityInLibrary ?? true,
        isRecommendedByDefault: d.isRecommendedByDefault ?? false,
        canBeAddedByUser: d.canBeAddedByUser ?? true,
        canBeRemovedByUser: d.canBeRemovedByUser ?? true,
        scope: d.scope || 'national',
        municipalityId: d.municipalityId,
        legacyScenarioId: d.legacyScenarioId,
        scenarios: d.scenarios || [],
      } as Bundle;
    });
  }

  // Fallback: generate synthetic onboarding bundles from static scenarios
  return staticScenarios.map(s => ({
    id: `onboarding-${s.id}`,
    bundleType: 'onboarding' as const,
    name: s.name,
    description: s.description,
    icon: s.icon,
    priority: 0,
    useInOnboarding: true,
    visibilityInLibrary: false,
    isRecommendedByDefault: true,
    canBeAddedByUser: false,
    canBeRemovedByUser: false,
    scope: 'national' as const,
    legacyScenarioId: s.id,
    scenarios: [s.id],
  }));
}

/**
 * Fetch onboarding bundles specifically (bundles with useInOnboarding=true).
 */
export function useOnboardingBundles(): Bundle[] {
  const allBundles = useBundles();
  return allBundles.filter(b => b.useInOnboarding || b.bundleType === 'onboarding');
}

/**
 * Fetch library bundles (visible in library, not onboarding-only).
 */
export function useLibraryBundles(): Bundle[] {
  const allBundles = useBundles();
  return allBundles.filter(b => b.visibilityInLibrary !== false);
}

/**
 * Fetch content_relations for given bundle IDs.
 */
export function useBundleRelations(bundleIds: string[]) {
  const { data } = useQuery({
    queryKey: ['content_relations', bundleIds],
    queryFn: () => fetchContentRelations(bundleIds),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: bundleIds.length > 0,
  });
  return data || [];
}
