import { useTranslation } from '@/hooks/useTranslation';
import { Info } from 'lucide-react';

interface FallbackBlockProps {
  municipalityName?: string;
}

export function FallbackBlock({ municipalityName }: FallbackBlockProps) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border-2 border-fallback-border bg-fallback p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
          <Info className="h-4 w-4 text-warning" />
        </div>
        <div>
          <p className="font-semibold text-fallback-foreground text-sm">
            {t('fallback.title')}{municipalityName ? ` — ${municipalityName}` : ''}
          </p>
          <p className="text-fallback-foreground/70 text-sm mt-1 leading-relaxed">
            {t('fallback.message')}
          </p>
        </div>
      </div>
    </div>
  );
}
