import { Globe } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function FinlandWideBlock({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border-2 border-finland-border bg-finland p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-info/15 flex items-center justify-center">
          <Globe className="h-3.5 w-3.5 text-info" />
        </div>
        <span className="text-sm font-semibold text-finland-foreground">{t('common.finlandWide')}</span>
      </div>
      {children}
    </div>
  );
}
