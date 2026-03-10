import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useTranslation } from '@/hooks/useTranslation';
import heroIllustration from '@/assets/hero-illustration.png';
import { useFilteredSteps } from '@/hooks/useFilteredData';
import { useBundles } from '@/hooks/useContentData';
import { AppShell } from '@/components/AppShell';
import { RouteStepCard } from '@/components/RouteStepCard';
import { scenarios } from '@/data/scenarios';
import { municipalities } from '@/data/municipalities';

import { TrendingUp, ChevronDown, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, hideStep } = useUser();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const { isCompleted } = useProgress();
  const steps = useFilteredSteps();
  
  const [expanded, setExpanded] = useState(false);

  // Bundle-first: find selected bundles for display
  const allBundles = useBundles();
  const selectedBundles = allBundles.filter(b => user.selectedBundleIds.includes(b.id));
  // Legacy fallback
  const scenario = scenarios.find(s => s.id === user.scenario);
  const primaryBundle = selectedBundles[0];
  const displayName = primaryBundle
    ? (primaryBundle.name[lang] || primaryBundle.name.en || '')
    : (scenario?.name[lang] || '');
  const displayIcon = primaryBundle?.icon || scenario?.icon || '📋';
  const extraBundleCount = selectedBundles.length > 1 ? selectedBundles.length - 1 : 0;
  const municipality = municipalities.find(m => m.id === user.municipality);
  const totalSteps = steps.length;
  const filteredCompleted = steps.filter(s => isCompleted(s.id)).length;
  const progressPct = totalSteps > 0 ? Math.round((filteredCompleted / totalSteps) * 100) : 0;

  const handleRemoveStep = (stepId: string) => {
    hideStep(stepId);
    toast(t('feed.stepRemoved'));
  };

  return (
    <AppShell title={t('nav.dashboard')}>
      <div className="px-5 py-6 space-y-7">
        {/* Welcome block */}
        <div className="space-y-4 animate-in">
          <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-sm">
            <img 
              src={heroIllustration} 
              alt="Welcome illustration" 
              className="w-full h-56 object-contain bg-accent/30 p-5"
            />
            <div className="p-5 space-y-3">
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t('dashboard.welcome')}</h2>
              <div className="flex flex-wrap gap-2">
                {displayName && (
                  <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-3 py-1.5 text-xs font-semibold">
                    {displayIcon} {displayName}
                  </span>
                )}
                {municipality && (
                  <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-3 py-1.5 text-xs font-semibold">
                    📍 {municipality.name[lang]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-xl border-2 border-border bg-card p-5 shadow-sm animate-in-delay-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[15px] font-semibold text-foreground">{t('dashboard.progress')}</span>
            </div>
            <span className="text-sm font-semibold text-primary">
              {filteredCompleted}/{totalSteps}
            </span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%`, animation: 'progress-fill 0.8s ease-out' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t('dashboard.completed')}</p>
        </div>

        {/* Route steps */}
        <div className="animate-in-delay-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t('dashboard.nextSteps')}
            </h3>
            {steps.length > 0 && (
              <span className="text-xs text-muted-foreground">{t('feed.swipeHint')}</span>
            )}
          </div>

          {steps.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <p>{t('feed.empty')}</p>
            </div>
          )}

          <div className="space-y-3">
            {(expanded ? steps : steps.slice(0, 5)).map((step, i) => (
              <div key={step.id} className={i < 5 ? `animate-in-delay-${Math.min(i + 1, 5)}` : undefined}>
                <RouteStepCard step={step} lang={lang} index={i} onRemove={handleRemoveStep} />
              </div>
            ))}
          </div>
          {steps.length > 5 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full flex items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-primary card-hover"
            >
              <ChevronDown className="h-4 w-4" />
              {t('dashboard.showMore').replace('{n}', String(steps.length - 5))}
            </button>
          )}

          {/* Library entry point */}
          <button
            onClick={() => navigate('/library')}
            className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-semibold card-hover"
          >
            <Package className="h-4 w-4" />
            {t('library.browse')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
