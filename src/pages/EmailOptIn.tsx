import { useState } from 'react';
import { saveSubscriber } from '@/services/subscriberService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShell } from '@/components/AppShell';
import { Mail, ArrowRight } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailOptIn() {
  const { user, setEmail, completeOnboarding } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmailLocal] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email.trim()) {
      setError(t('onboarding.email.errorEmpty'));
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError(t('onboarding.email.errorInvalid'));
      return false;
    }
    return true;
  };

  const handleEmailChange = (value: string) => {
    setEmailLocal(value);
    if (error) {
      if (value.trim() && EMAIL_REGEX.test(value.trim())) {
        setError('');
      } else if (value.trim() && error === t('onboarding.email.errorEmpty')) {
        setError('');
      }
    }
  };

  const skip = () => {
    completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  const submit = async () => {
    if (!validate()) return;
    
    // Save to backend (fire-and-forget, don't block onboarding)
    saveSubscriber({
      email: email.trim(),
      consent,
      language: user.language,
      municipality: user.municipality,
      scenario: user.scenario,
    });

    setEmail(email.trim(), consent);
    completeOnboarding();
    navigate('/dashboard', { replace: true });
  };

  return (
    <AppShell title={t('onboarding.email.title')} showBack showNav={false}>
      <div className="px-5 py-6 space-y-8">
        <div className="text-center space-y-4 animate-in">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[260px] mx-auto">
            {t('onboarding.email.subtitle')}
          </p>
        </div>

        <div className="space-y-4 animate-in-delay-1">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              placeholder={t('onboarding.email.placeholder')}
              className={`w-full rounded-xl border-2 bg-background px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                error ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
              }`}
            />
            {error && (
              <p className="text-sm text-destructive font-medium px-1">{error}</p>
            )}
          </div>
          <label className="flex items-start gap-3 cursor-pointer p-1">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 rounded border-input h-4 w-4 accent-primary"
            />
            <span className="text-sm text-muted-foreground leading-relaxed">{t('onboarding.email.consent')}</span>
          </label>
        </div>

        <div className="space-y-3 animate-in-delay-2">
          <button
            onClick={submit}
            className="w-full rounded-xl bg-primary text-primary-foreground py-3.5 text-[15px] font-semibold transition-all hover:shadow-md hover:bg-primary/90 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {t('onboarding.email.continue')}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={skip}
            className="w-full rounded-xl border-2 border-border py-3.5 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all active:scale-[0.98]"
          >
            {t('onboarding.email.skip')}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
