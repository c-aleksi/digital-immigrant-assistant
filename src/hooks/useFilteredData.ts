import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useArticles, useRouteSteps, useResources, useContacts, useBundles, useBundleRelations } from '@/hooks/useContentData';
import { RouteStep, ReferenceArticle, LocalResource, ContactPoint } from '@/types';

/**
 * Bundle-first step filtering:
 * 1. If user has selectedBundleIds → resolve steps via content_relations
 * 2. Fallback to legacy scenario filtering for backward compat
 */
export function useFilteredSteps(): RouteStep[] {
  const { user } = useUser();
  const routeSteps = useRouteSteps();
  const bundles = useBundles();
  const relations = useBundleRelations(user.selectedBundleIds);

  return useMemo(() => {
    if (!user.municipality) return [];

    const hiddenSet = new Set(user.hiddenStepIds || []);

    // Bundle-first: if we have relations from selected bundles, use them
    if (user.selectedBundleIds.length > 0 && relations.length > 0) {
      // Deduplicate: use a Set to prevent the same step appearing twice from multiple bundles
      const seen = new Set<string>();
      const childIds = relations
        .sort((a, b) => a.position - b.position)
        .map(r => r.child_id)
        .filter(id => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      
      const stepsFromBundles = childIds
        .map(id => routeSteps.find(s => s.id === id))
        .filter((s): s is RouteStep => !!s)
        .filter(s => s.municipalityId === 'all' || s.municipalityId === user.municipality)
        .filter(s => !hiddenSet.has(s.id));
      
      if (stepsFromBundles.length > 0) return stepsFromBundles;
    }

    // Legacy fallback: filter by scenario
    if (!user.scenario) return [];
    return routeSteps
      .filter(s => s.scenarios.includes(user.scenario!))
      .filter(s => s.municipalityId === 'all' || s.municipalityId === user.municipality)
      .filter(s => !hiddenSet.has(s.id))
      .sort((a, b) => a.priority - b.priority);
  }, [user.scenario, user.municipality, user.selectedBundleIds, user.hiddenStepIds, routeSteps, relations]);
}

export function useFilteredArticles(): ReferenceArticle[] {
  const { user } = useUser();
  const articles = useArticles();
  return useMemo(() => {
    if (!user.scenario) return articles;
    return articles
      .filter(a => a.scenarios.includes(user.scenario!))
      .filter(a => a.municipalityId === 'all' || a.municipalityId === user.municipality);
  }, [user.scenario, user.municipality, articles]);
}

export function useFilteredResources(): { local: LocalResource[]; general: LocalResource[] } {
  const { user } = useUser();
  const resources = useResources();
  return useMemo(() => {
    const local = resources.filter(r => r.municipalityId === user.municipality);
    const general = resources.filter(r => r.municipalityId === 'all');
    return { local, general };
  }, [user.municipality, resources]);
}

export function useFilteredContacts(): { local: ContactPoint[]; general: ContactPoint[]; emergency: ContactPoint[] } {
  const { user } = useUser();
  const allContacts = useContacts();
  return useMemo(() => {
    const emergency = allContacts.filter(c => c.isEmergency);
    const local = allContacts.filter(c => c.municipalityId === user.municipality && !c.isEmergency);
    const general = allContacts.filter(c => c.municipalityId === 'all' && !c.isEmergency);
    return { local, general, emergency };
  }, [user.municipality, allContacts]);
}
