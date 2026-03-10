import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useFilteredSteps } from '@/hooks/useFilteredData';
import { useBundles } from '@/hooks/useContentData';
import { AppShell } from '@/components/AppShell';
import { scenarios } from '@/data/scenarios';
import { municipalities } from '@/data/municipalities';
import { useNavigate } from 'react-router-dom';
import { Settings, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { deleteSubscriber } from '@/services/subscriberService';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Profile() {
  const { user, setLanguage, resetAll } = useUser();
  const { t, lang } = useTranslation();
  const { completedCount, resetProgress } = useProgress();
  const steps = useFilteredSteps();
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);

  // Bundle-first display
  const allBundles = useBundles();
  const selectedBundles = allBundles.filter(b => user.selectedBundleIds.includes(b.id));
  const primaryBundle = selectedBundles[0];
  // Legacy fallback
  const scenario = scenarios.find(s => s.id === user.scenario);
  const displayName = primaryBundle
    ? (primaryBundle.name[lang] || primaryBundle.name.en || '')
    : (scenario?.name[lang] || '');
  const displayIcon = primaryBundle?.icon || scenario?.icon || '📋';
  const municipality = municipalities.find(m => m.id === user.municipality);

  const handleResetAll = async () => {
    setResetting(true);
    try {
      if (user.email) {
        const result = await deleteSubscriber(user.email);
        if (!result.success) {
          toast({ title: t('profile.resetError') || 'Failed to unsubscribe. Please try again.', variant: 'destructive' });
          setResetting(false);
          return;
        }
      }
      resetAll();
      resetProgress();
      navigate('/', { replace: true });
    } catch {
      toast({ title: t('profile.resetError') || 'Failed to unsubscribe. Please try again.', variant: 'destructive' });
      setResetting(false);
    }
  };

  return (
    <AppShell title={t('profile.title')}>
      <div className="px-5 py-6 space-y-6">
        {/* Avatar section */}
        <div className="flex items-center gap-4 animate-in">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <Settings className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg tracking-tight">{displayName}</p>
            <p className="text-sm text-muted-foreground font-medium">📍 {municipality?.name[lang]}</p>
          </div>
        </div>

        {/* Settings cards */}
        <div className="space-y-3">
          {/* Language */}
          <div className="rounded-xl border-2 border-border bg-card p-4 animate-in-delay-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t('profile.language')}</p>
            <div className="flex gap-2">
              {(['en', 'ru'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    user.language === l
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {l === 'en' ? '🇬🇧 English' : '🇷🇺 Русский'}
                </button>
              ))}
            </div>
          </div>

          {/* Info cards */}
          {[
            { label: t('profile.scenario'), value: `${displayIcon} ${displayName}` },
            { label: t('profile.municipality'), value: `📍 ${municipality?.name[lang]}` },
            { label: t('profile.email'), value: user.email || t('profile.notProvided'), sub: `${t('profile.consent')}: ${user.consent ? t('profile.yes') : t('profile.no')}` },
            { label: t('profile.progress'), value: `${completedCount}/${steps.length} ${t('dashboard.completed')}` },
          ].map((item, i) => (
            <div key={item.label} className={`rounded-xl border-2 border-border bg-card p-4 animate-in-delay-${Math.min(i + 2, 5)}`}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{item.label}</p>
              <p className="text-[15px] font-medium text-foreground">{item.value}</p>
              {item.sub && <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2 animate-in-delay-5">
          <button
            onClick={resetProgress}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-border py-3.5 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            {t('profile.resetProgress')}
          </button>
          <button
            onClick={handleResetAll}
            disabled={resetting}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-destructive/30 py-3.5 text-[15px] font-medium text-destructive hover:bg-destructive/5 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {t('profile.resetAll')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
