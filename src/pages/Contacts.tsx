import { useTranslation } from '@/hooks/useTranslation';
import { useFilteredContacts } from '@/hooks/useFilteredData';
import { useUser } from '@/contexts/UserContext';
import { AppShell } from '@/components/AppShell';
import { FallbackBlock } from '@/components/FallbackBlock';
import { FinlandWideBlock } from '@/components/FinlandWideBlock';
import { municipalities } from '@/data/municipalities';
import { ContactPoint, Language } from '@/types';
import { Phone, Mail, ExternalLink, AlertTriangle, MapPin } from 'lucide-react';

function ContactCard({ contact, lang }: { contact: ContactPoint; lang: Language }) {
  return (
    <div className={`rounded-xl border-2 p-4 space-y-2 ${
      contact.isEmergency
        ? 'border-destructive/30 bg-destructive/5'
        : 'border-border bg-card'
    }`}>
      <div className="flex items-center gap-2">
        {contact.isEmergency && <AlertTriangle className="h-4 w-4 text-destructive" />}
        <p className="text-[15px] font-semibold text-foreground">{contact.name[lang]}</p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{contact.description[lang]}</p>
      {contact.phone && (
        <p className="text-sm text-foreground flex items-center gap-2 font-medium">
          <Phone className="h-3.5 w-3.5 text-primary" /> {contact.phone}
        </p>
      )}
      {contact.email && (
        <p className="text-sm text-foreground flex items-center gap-2 font-medium">
          <Mail className="h-3.5 w-3.5 text-primary" /> {contact.email}
        </p>
      )}
      {contact.address && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" /> {contact.address}
        </p>
      )}
      {contact.url && (
        <a href={contact.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
          <ExternalLink className="h-3.5 w-3.5" /> Website
        </a>
      )}
    </div>
  );
}

export default function Contacts() {
  const { t, lang } = useTranslation();
  const { user } = useUser();
  const { local, general, emergency } = useFilteredContacts();
  const municipality = municipalities.find(m => m.id === user.municipality);

  return (
    <AppShell title={t('contacts.title')}>
      <div className="px-5 py-6 space-y-6">
        {emergency.length > 0 && (
          <div className="animate-in">
            <h3 className="text-sm font-semibold text-destructive mb-3 uppercase tracking-wide">{t('contacts.emergency')}</h3>
            <div className="space-y-2.5">
              {emergency.map(c => <ContactCard key={c.id} contact={c} lang={lang} />)}
            </div>
          </div>
        )}

        <div className="animate-in-delay-1">
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
            {t('contacts.local')} — {municipality?.name[lang]}
          </h3>
          {local.length > 0 ? (
            <div className="space-y-2.5">
              {local.map(c => <ContactCard key={c.id} contact={c} lang={lang} />)}
            </div>
          ) : (
            <FallbackBlock municipalityName={municipality?.name[lang]} />
          )}
        </div>

        <div className="animate-in-delay-2">
          <FinlandWideBlock>
            <div className="space-y-2.5">
              {general.map(c => <ContactCard key={c.id} contact={c} lang={lang} />)}
            </div>
          </FinlandWideBlock>
        </div>
      </div>
    </AppShell>
  );
}
