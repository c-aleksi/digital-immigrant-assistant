import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShell } from '@/components/AppShell';
import { FallbackBlock } from '@/components/FallbackBlock';
import { FinlandWideBlock } from '@/components/FinlandWideBlock';
import { useRouteSteps, useArticles } from '@/hooks/useContentData';
import { contacts } from '@/data/contacts';
import { municipalities } from '@/data/municipalities';
import { Check, ExternalLink, ChevronRight } from 'lucide-react';

export default function RouteStepDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { t, lang } = useTranslation();
  const { isCompleted, toggleStep } = useProgress();
  const navigate = useNavigate();
  const routeSteps = useRouteSteps();
  const articles = useArticles();

  const step = routeSteps.find(s => s.id === id);
  if (!step) return <AppShell title={t('common.back')} showBack><div className="p-5 text-muted-foreground">{t('common.noResults')}</div></AppShell>;

  const completed = isCompleted(step.id);
  const municipality = municipalities.find(m => m.id === user.municipality);
  const isLocalStep = step.municipalityId !== 'all';

  const localStep = step.municipalityId === 'all'
    ? routeSteps.find(s => s.categoryId === step.categoryId && s.municipalityId === user.municipality)
    : step;
  const generalStep = step.municipalityId !== 'all'
    ? routeSteps.find(s => s.categoryId === step.categoryId && s.municipalityId === 'all')
    : step;

  const relatedArticles = step.relatedArticleIds?.map(aid => articles.find(a => a.id === aid)).filter(Boolean) ?? [];
  const relatedContacts = step.relatedContactIds?.map(cid => contacts.find(c => c.id === cid)).filter(Boolean) ?? [];

  return (
    <AppShell title={step.title[lang]} showBack>
      <div className="px-5 py-6 space-y-6">
        {/* Action description */}
        <div className="space-y-3 animate-in">
          <span className="inline-block text-sm font-semibold text-primary">{step.shortAction[lang]}</span>
          <p className="text-[15px] text-foreground leading-relaxed whitespace-pre-line">{step.description[lang]}</p>
        </div>

        {/* Local info */}
        {isLocalStep && (
          <div className="rounded-xl border-2 border-primary/20 bg-accent p-4 animate-in-delay-1">
            <p className="text-xs font-semibold text-primary mb-2">{t('common.localInfo')} — {municipality?.name[lang]}</p>
            <p className="text-sm text-foreground leading-relaxed">{step.description[lang]}</p>
          </div>
        )}

        {!isLocalStep && !localStep && municipality && (
          <div className="animate-in-delay-1"><FallbackBlock municipalityName={municipality.name[lang]} /></div>
        )}

        {isLocalStep && generalStep && (
          <div className="animate-in-delay-2">
            <FinlandWideBlock>
              <p className="text-sm text-finland-foreground leading-relaxed">{generalStep.description[lang]}</p>
            </FinlandWideBlock>
          </div>
        )}

        {/* Official links */}
        {step.officialLinks && step.officialLinks.length > 0 && (
          <div className="animate-in-delay-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('common.officialLinks')}</h3>
            <div className="space-y-2">
              {step.officialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-3.5 text-sm font-medium text-primary card-hover"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span>{link.label[lang]}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="animate-in-delay-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('common.relatedArticles')}</h3>
            <div className="space-y-2">
              {relatedArticles.map(a => a && (
                <button
                  key={a.id}
                  onClick={() => navigate(`/article/${a.id}`)}
                  className="w-full text-left rounded-xl border-2 border-border bg-card p-3.5 card-hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.title[lang]}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.summary[lang]}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related contacts */}
        {relatedContacts.length > 0 && (
          <div className="animate-in-delay-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('common.relatedContacts')}</h3>
            <div className="space-y-2">
              {relatedContacts.map(c => c && (
                <div key={c.id} className="rounded-xl border-2 border-border bg-card p-3.5">
                  <p className="text-sm font-semibold text-foreground">{c.name[lang]}</p>
                  {c.phone && <p className="text-xs text-muted-foreground mt-1.5">📞 {c.phone}</p>}
                  {c.address && <p className="text-xs text-muted-foreground">📍 {c.address}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete button */}
        <div className="animate-in-delay-4">
          <button
            onClick={() => toggleStep(step.id)}
            className={`w-full rounded-xl py-3.5 text-[15px] font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
              completed
                ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                : 'bg-success text-success-foreground hover:shadow-md hover:bg-success/90'
            }`}
          >
            <Check className="h-4 w-4" />
            {completed ? t('common.markUndone') : t('common.markDone')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
