import { useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShell } from '@/components/AppShell';
import { useArticles } from '@/hooks/useContentData';
import { categories } from '@/data/categories';
import { ExternalLink } from 'lucide-react';

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useTranslation();
  const articles = useArticles();

  const article = articles.find(a => a.id === id);
  if (!article) return <AppShell title={t('common.back')} showBack><div className="p-5 text-muted-foreground">{t('common.noResults')}</div></AppShell>;

  const category = categories.find(c => c.id === article.categoryId);

  return (
    <AppShell title={article.title[lang]} showBack>
      <div className="px-5 py-6 space-y-5">
        {category && (
          <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground px-3 py-1.5 text-xs font-semibold animate-in">
            {category.icon} {category.name[lang]}
          </span>
        )}
        <p className="text-[15px] text-primary font-semibold leading-relaxed animate-in-delay-1">{article.summary[lang]}</p>
        <div className="text-[15px] text-foreground leading-[1.75] whitespace-pre-line animate-in-delay-2">
          {article.content[lang]}
        </div>
        {article.officialLinks && article.officialLinks.length > 0 && (
          <div className="animate-in-delay-3">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t('common.officialLinks')}</h3>
            <div className="space-y-2">
              {article.officialLinks.map((link, i) => (
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
      </div>
    </AppShell>
  );
}
