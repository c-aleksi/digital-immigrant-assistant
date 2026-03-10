import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useUser } from '@/contexts/UserContext';
import { AppShell } from '@/components/AppShell';
import { useRouteSteps, useArticles } from '@/hooks/useContentData';
import { resources } from '@/data/resources';
import { contacts } from '@/data/contacts';
import { Search as SearchIcon, ChevronRight } from 'lucide-react';

type FilterType = 'all' | 'steps' | 'articles' | 'resources' | 'contacts';

export default function SearchPage() {
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const routeSteps = useRouteSteps();
  const articles = useArticles();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('search.filter.all') },
    { key: 'steps', label: t('search.filter.steps') },
    { key: 'articles', label: t('search.filter.articles') },
    { key: 'resources', label: t('search.filter.resources') },
    { key: 'contacts', label: t('search.filter.contacts') },
  ];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const items: { type: FilterType; id: string; title: string; subtitle: string; path: string }[] = [];

    if (filter === 'all' || filter === 'steps') {
      routeSteps
        .filter(s => s.title[lang].toLowerCase().includes(q) || s.shortAction[lang].toLowerCase().includes(q))
        .filter(s => s.scenarios.includes(user.scenario!) || !user.scenario)
        .forEach(s => items.push({ type: 'steps', id: s.id, title: s.title[lang], subtitle: s.shortAction[lang], path: `/step/${s.id}` }));
    }
    if (filter === 'all' || filter === 'articles') {
      articles
        .filter(a => a.title[lang].toLowerCase().includes(q) || a.summary[lang].toLowerCase().includes(q))
        .forEach(a => items.push({ type: 'articles', id: a.id, title: a.title[lang], subtitle: a.summary[lang], path: `/article/${a.id}` }));
    }
    if (filter === 'all' || filter === 'resources') {
      resources
        .filter(r => r.name[lang].toLowerCase().includes(q) || r.description[lang].toLowerCase().includes(q))
        .forEach(r => items.push({ type: 'resources', id: r.id, title: r.name[lang], subtitle: r.description[lang], path: '/resources' }));
    }
    if (filter === 'all' || filter === 'contacts') {
      contacts
        .filter(c => c.name[lang].toLowerCase().includes(q) || c.description[lang].toLowerCase().includes(q))
        .forEach(c => items.push({ type: 'contacts', id: c.id, title: c.name[lang], subtitle: c.description[lang], path: '/contacts' }));
    }

    return items.sort((a, b) => {
      const aLocal = routeSteps.find(s => s.id === a.id)?.municipalityId === user.municipality ? -1 : 0;
      const bLocal = routeSteps.find(s => s.id === b.id)?.municipalityId === user.municipality ? -1 : 0;
      return aLocal - bLocal;
    });
  }, [query, filter, lang, user.scenario, user.municipality]);

  return (
    <AppShell title={t('search.title')}>
      <div className="px-5 py-6 space-y-5">
        <div className="relative animate-in">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full rounded-xl border-2 border-input bg-card pl-12 pr-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 animate-in-delay-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {query.trim() && results.length === 0 && (
          <p className="text-[15px] text-muted-foreground text-center py-10">{t('common.noResults')}</p>
        )}

        <div className="space-y-2.5">
          {results.map((item, i) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => navigate(item.path)}
              className={`w-full text-left rounded-xl border-2 border-border bg-card p-4 card-hover animate-in-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider rounded-md bg-accent text-accent-foreground px-2 py-0.5 mb-1.5">
                    {item.type}
                  </span>
                  <p className="text-[15px] font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
