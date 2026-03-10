import { useTranslation } from '@/hooks/useTranslation';
import { useFilteredResources } from '@/hooks/useFilteredData';
import { useUser } from '@/contexts/UserContext';
import { AppShell } from '@/components/AppShell';
import { FallbackBlock } from '@/components/FallbackBlock';
import { FinlandWideBlock } from '@/components/FinlandWideBlock';
import { municipalities } from '@/data/municipalities';
import { categories } from '@/data/categories';
import { ExternalLink, MapPin, Phone as PhoneIcon } from 'lucide-react';
import { LocalResource, Language } from '@/types';
import { useNavigate } from 'react-router-dom';

function ResourceCard({ resource, lang }: { resource: LocalResource; lang: Language }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 space-y-2">
      <p className="text-[15px] font-semibold text-foreground">{resource.name[lang]}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{resource.description[lang]}</p>
      {resource.address && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />{resource.address}
        </p>
      )}
      {resource.phone && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <PhoneIcon className="h-3.5 w-3.5" />{resource.phone}
        </p>
      )}
      {resource.url && (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> {resource.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
        </a>
      )}
    </div>
  );
}

export default function LocalResources() {
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const { local, general } = useFilteredResources();
  const municipality = municipalities.find(m => m.id === user.municipality);

  const groupByCategory = (items: LocalResource[]) => {
    const grouped: Record<string, LocalResource[]> = {};
    items.forEach(item => {
      if (!grouped[item.categoryId]) grouped[item.categoryId] = [];
      grouped[item.categoryId].push(item);
    });
    return grouped;
  };

  const localGrouped = groupByCategory(local);
  const generalGrouped = groupByCategory(general);

  return (
    <AppShell title={t('resources.title')}>
      <div className="px-5 py-6 space-y-6">
        {local.length > 0 ? (
          Object.entries(localGrouped).map(([catId, items], i) => {
            const cat = categories.find(c => c.id === catId);
            return (
              <div key={catId} className={`animate-in-delay-${Math.min(i + 1, 5)}`}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span>{cat?.icon}</span> {cat?.name[lang]} — {municipality?.name[lang]}
                </h3>
                <div className="space-y-2.5">
                  {items.map(r => <ResourceCard key={r.id} resource={r} lang={lang} />)}
                </div>
              </div>
            );
          })
        ) : (
          <div className="animate-in">
            <FallbackBlock municipalityName={municipality?.name[lang]} />
          </div>
        )}

        <div className="animate-in-delay-3">
          <FinlandWideBlock>
            <div className="space-y-5">
              {Object.entries(generalGrouped).map(([catId, items]) => {
                const cat = categories.find(c => c.id === catId);
                return (
                  <div key={catId}>
                    <h4 className="text-xs font-semibold text-finland-foreground mb-2 uppercase tracking-wide">
                      {cat?.icon} {cat?.name[lang]}
                    </h4>
                    <div className="space-y-2.5">
                      {items.map(r => <ResourceCard key={r.id} resource={r} lang={lang} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </FinlandWideBlock>
        </div>

        {/* Quick link to Contacts */}
        <button
          onClick={() => navigate('/contacts')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm font-semibold text-primary card-hover"
        >
          <PhoneIcon className="h-4 w-4" />
          {t('contacts.title')}
        </button>
      </div>
    </AppShell>
  );
}
