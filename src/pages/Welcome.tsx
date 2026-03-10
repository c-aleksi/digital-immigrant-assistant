import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Language } from '@/types';
import { Globe2, ArrowRight } from 'lucide-react';

export default function Welcome() {
  const { setLanguage } = useUser();
  const navigate = useNavigate();

  const selectLang = (lang: Language) => {
    setLanguage(lang);
    navigate('/onboarding/scenario');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-10 animate-in">
        {/* Hero */}
        <div className="text-center space-y-5">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg animate-in">
            <Globe2 className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="text-[26px] font-extrabold text-foreground tracking-tight leading-tight">
              Digital Immigrant<br />Assistant
            </h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[280px] mx-auto">
              Your personal guide to settling in Finland.<br />
              Ваш персональный гид по обустройству в Финляндии.
            </p>
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-3 animate-in-delay-2">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Choose your language / Выберите язык
          </p>
          <button
            onClick={() => selectLang('en')}
            className="w-full rounded-xl border-2 border-border bg-card p-4 text-left card-hover group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇬🇧</span>
              <span className="font-semibold text-foreground text-[15px]">English</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>
          <button
            onClick={() => selectLang('ru')}
            className="w-full rounded-xl border-2 border-border bg-card p-4 text-left card-hover group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇷🇺</span>
              <span className="font-semibold text-foreground text-[15px]">Русский</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
