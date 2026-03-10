import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useBundles, useBundleRelations } from '@/hooks/useContentData';
import { useRouteSteps } from '@/hooks/useContentData';
import { AppShell } from '@/components/AppShell';
import { Bundle, RouteStep } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Check, ChevronLeft, Trash2, Package, Info } from 'lucide-react';
import { toast } from 'sonner';

function BundleCard({
  bundle,
  lang,
  isAdded,
  onSelect,
}: {
  bundle: Bundle;
  lang: string;
  isAdded: boolean;
  onSelect: () => void;
}) {
  const title = bundle.name[lang] || bundle.name.en || bundle.id;
  const desc = bundle.description[lang] || bundle.description.en || '';

  return (
    <Card
      className="cursor-pointer card-hover border-2 border-border"
      onClick={onSelect}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-lg shrink-0">
          {bundle.icon || '📦'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
          {desc && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{desc}</p>}
          <div className="flex items-center gap-2 mt-2">
            {isAdded && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-0.5">
                <Check className="h-3 w-3" /> {bundle.name[lang] ? 'Added' : 'Added'}
              </span>
            )}
          </div>
        </div>
        <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180 shrink-0 mt-1" />
      </CardContent>
    </Card>
  );
}

function BundleDetail({
  bundle,
  lang,
  isAdded,
  steps,
  onBack,
  onAdd,
  onRemove,
  t,
}: {
  bundle: Bundle;
  lang: string;
  isAdded: boolean;
  steps: RouteStep[];
  onBack: () => void;
  onAdd: () => void;
  onRemove: () => void;
  t: (key: string) => string;
}) {
  const title = bundle.name[lang] || bundle.name.en || bundle.id;
  const desc = bundle.description[lang] || bundle.description.en || '';
  const canAdd = bundle.canBeAddedByUser !== false;
  const canRemove = bundle.canBeRemovedByUser !== false;

  return (
    <div className="px-5 py-6 space-y-5 animate-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('library.backToList')}
      </button>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-xl">
            {bundle.icon || '📦'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
        </div>
        {desc && <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>}
      </div>

      {/* Action */}
      <div>
        {isAdded ? (
          canRemove ? (
            <Button variant="outline" className="w-full gap-2" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
              {t('library.removeBundle')}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-2 flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4 text-success" />
              {t('library.alreadyAdded')}
            </div>
          )
        ) : canAdd ? (
          <Button className="w-full gap-2" onClick={onAdd}>
            <Plus className="h-4 w-4" />
            {t('library.addBundle')}
          </Button>
        ) : null}
      </div>

      {/* Steps in this bundle */}
      {steps.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t('library.includedSteps')} ({steps.length})
          </h3>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card"
              >
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {step.title[lang] || step.title.en || step.id}
                  </p>
                  {(step.shortAction[lang] || step.shortAction.en) && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {step.shortAction[lang] || step.shortAction.en || ''}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 py-6 justify-center text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          {t('library.noStepsYet')}
        </div>
      )}
    </div>
  );
}

export default function BundleLibrary() {
  const { user, addBundle, removeBundle, clearHiddenStepsForBundle } = useUser();
  const { t, lang } = useTranslation();
  const allBundles = useBundles();
  const allSteps = useRouteSteps();
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

  // Only show bundles visible in library
  const libraryBundles = allBundles.filter(b => b.visibilityInLibrary !== false);

  // Fetch relations for selected bundle
  const relationsQuery = useBundleRelations(selectedBundleId ? [selectedBundleId] : []);

  const selectedBundle = selectedBundleId
    ? libraryBundles.find(b => b.id === selectedBundleId)
    : null;

  const bundleSteps = selectedBundleId
    ? relationsQuery
        .sort((a, b) => a.position - b.position)
        .map(r => allSteps.find(s => s.id === r.child_id))
        .filter((s): s is RouteStep => !!s)
    : [];

  const isAdded = (bundleId: string) => user.selectedBundleIds.includes(bundleId);

  const handleAdd = (bundleId: string) => {
    // When re-adding a bundle, restore any previously hidden steps from that bundle
    const rels = bundleId === selectedBundleId ? relationsQuery : [];
    if (rels.length > 0) {
      clearHiddenStepsForBundle(rels.map(r => r.child_id));
    }
    addBundle(bundleId);
    const bundle = libraryBundles.find(b => b.id === bundleId);
    const name = bundle?.name[lang] || bundle?.name.en || '';
    toast.success(t('library.toastAdded').replace('{name}', name));
  };

  const handleRemove = (bundleId: string) => {
    removeBundle(bundleId);
    const bundle = libraryBundles.find(b => b.id === bundleId);
    const name = bundle?.name[lang] || bundle?.name.en || '';
    toast(t('library.toastRemoved').replace('{name}', name));
  };

  if (selectedBundle) {
    return (
      <AppShell title={t('library.title')}>
        <BundleDetail
          bundle={selectedBundle}
          lang={lang}
          isAdded={isAdded(selectedBundle.id)}
          steps={bundleSteps}
          onBack={() => setSelectedBundleId(null)}
          onAdd={() => handleAdd(selectedBundle.id)}
          onRemove={() => handleRemove(selectedBundle.id)}
          t={t}
        />
      </AppShell>
    );
  }

  // Separate onboarding and regular bundles
  const onboardingBundles = libraryBundles.filter(
    b => b.useInOnboarding || b.bundleType === 'onboarding'
  );
  const regularBundles = libraryBundles.filter(
    b => !b.useInOnboarding && b.bundleType !== 'onboarding'
  );

  return (
    <AppShell title={t('library.title')}>
      <div className="px-5 py-6 space-y-6">
        {/* Header */}
        <div className="animate-in">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{t('library.heading')}</h2>
              <p className="text-xs text-muted-foreground">{t('library.subtitle')}</p>
            </div>
          </div>
        </div>

        {libraryBundles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {t('library.empty')}
          </div>
        )}

        {/* Guides section first — primary content */}
        {regularBundles.length > 0 && (
          <div className="space-y-3 animate-in-delay-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('library.guidesSection')}
            </h3>
            <div className="space-y-2">
              {regularBundles.map(b => (
                <BundleCard
                  key={b.id}
                  bundle={b}
                  lang={lang}
                  isAdded={isAdded(b.id)}
                  onSelect={() => setSelectedBundleId(b.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Onboarding bundles section */}
        {onboardingBundles.length > 0 && (
          <div className="space-y-3 animate-in-delay-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t('library.onboardingSection')}
            </h3>
            <div className="space-y-2">
              {onboardingBundles.map(b => (
                <BundleCard
                  key={b.id}
                  bundle={b}
                  lang={lang}
                  isAdded={isAdded(b.id)}
                  onSelect={() => setSelectedBundleId(b.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
