import { useUser } from '@/contexts/UserContext';
import { t } from '@/i18n/translations';
import { Language } from '@/types';

export function useTranslation() {
  const { user } = useUser();
  const lang: Language = user.language;
  return {
    t: (key: string) => t(key, lang),
    lang,
  };
}
