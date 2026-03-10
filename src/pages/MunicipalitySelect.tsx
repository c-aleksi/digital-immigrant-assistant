import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { municipalities } from '@/data/municipalities';
import { AppShell } from '@/components/AppShell';
import { MapPin, ArrowRight, ChevronDown, Check } from 'lucide-react';
import { MunicipalityId } from '@/types';

export default function MunicipalitySelect() {
  const { user, setMunicipality } = useUser();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MunicipalityId | null>(user.municipality);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedName = useMemo(() => {
    const m = municipalities.find(m => m.id === selected);
    return m ? m.name[lang] : '';
  }, [selected, lang]);

  const filtered = useMemo(() => {
    if (search.length < 3) return municipalities;
    const q = search.toLowerCase();
    return municipalities.filter(m =>
      m.name.en.toLowerCase().includes(q) ||
      m.name.ru.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: MunicipalityId) => {
    setSelected(id);
    setOpen(false);
    setSearch('');
  };

  const handleContinue = () => {
    if (!selected) return;
    setMunicipality(selected);
    navigate('/onboarding/email');
  };

  return (
    <AppShell title={t('onboarding.municipality.title')} showBack showNav={false}>
      <div className="px-5 py-6 space-y-5">
        <p className="text-[15px] text-muted-foreground leading-relaxed animate-in">
          {t('onboarding.municipality.subtitle')}
        </p>

        <div ref={containerRef} className="relative animate-in">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`flex w-full items-center justify-between rounded-xl border-2 bg-card px-4 py-3.5 text-[15px] transition-all ${
              open ? 'border-primary ring-2 ring-primary/20' : 'border-border'
            } ${selected ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {selected ? selectedName : t('onboarding.municipality.placeholder')}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="p-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t('onboarding.municipality.search')}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>
              <ul className="max-h-60 overflow-y-auto py-1">
                {(search.length >= 3 ? filtered : municipalities).map(m => {
                  const isSelected = selected === m.id;
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(m.id)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-[15px] transition-colors hover:bg-accent ${
                          isSelected ? 'bg-accent font-semibold text-primary' : 'text-foreground'
                        }`}
                      >
                        <span>{m.name[lang]}</span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    </li>
                  );
                })}
                {search.length >= 3 && filtered.length === 0 && (
                  <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                    {t('onboarding.municipality.noResults')}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className={`pt-2 animate-in-delay-5 ${open ? 'invisible' : ''}`}>
          <button
            onClick={handleContinue}
            disabled={!selected}
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
