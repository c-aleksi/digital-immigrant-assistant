import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useOnboardingBundles } from '@/hooks/useContentData';
import { AppShell } from '@/components/AppShell';
import { ArrowRight, Check } from 'lucide-react';
import { ScenarioId, Bundle } from '@/types';

export default function ScenarioSelect() {
  const { user, selectOnboardingBundle } = useUser();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const onboardingBundles = useOnboardingBundles();

  // Find currently selected bundle
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    // Check if user already has a selected bundle
    const existing = user.selectedBundleIds.find(id =>
      onboardingBundles.some(b => b.id === id)
    );
    if (existing) return existing;
    // Legacy: if user has a scenario, find matching bundle
    if (user.scenario) {
      const match = onboardingBundles.find(b => b.legacyScenarioId === user.scenario);
      return match?.id || null;
    }
    return null;
  });

  const handleContinue = () => {
    if (!selectedId) return;
    const bundle = onboardingBundles.find(b => b.id === selectedId);
    if (!bundle) return;
    // Select the bundle + set legacy scenario for backward compat
    selectOnboardingBundle(bundle.id, bundle.legacyScenarioId as ScenarioId | undefined);
    navigate('/onboarding/municipality');
  };

  return (
    <AppShell title={t('onboarding.scenario.title')} showBack showNav={false}>
      <div className="px-5 py-6 space-y-5">
        <p className="text-[15px] text-muted-foreground leading-relaxed animate-in">
          {t('onboarding.scenario.subtitle')}
        </p>
        <div className="space-y-3">
          {onboardingBundles
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
            .map((bundle, i) => {
              const isSelected = selectedId === bundle.id;
              const name = bundle.name[lang] || bundle.name.en || '';
              const desc = bundle.description[lang] || bundle.description.en || '';
              return (
                <button
                  key={bundle.id}
                  onClick={() => setSelectedId(bundle.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left card-hover group transition-all animate-in-delay-${Math.min(i + 1, 5)} ${
                    isSelected
                      ? 'border-primary bg-accent shadow-sm'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{bundle.icon || '📦'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-[15px]">{name}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                    </div>
                    {isSelected && (
                      <div className="shrink-0 mt-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
        </div>

        <div className="pt-2 animate-in-delay-5">
          <button
            onClick={handleContinue}
            disabled={!selectedId}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 text-[15px] font-semibold disabled:opacity-40 transition-all hover:shadow-md hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {t('common.continue')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
