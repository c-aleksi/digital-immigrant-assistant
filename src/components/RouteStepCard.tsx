import { RouteStep, Language } from '@/types';
import { useProgress } from '@/contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, X } from 'lucide-react';
import { categories } from '@/data/categories';

interface RouteStepCardProps {
  step: RouteStep;
  lang: Language;
  index?: number;
  onRemove?: (stepId: string) => void;
}

export function RouteStepCard({ step, lang, index, onRemove }: RouteStepCardProps) {
  const { isCompleted } = useProgress();
  const navigate = useNavigate();
  const completed = isCompleted(step.id);
  const category = categories.find(c => c.id === step.categoryId);

  return (
    <div className="relative group">
      <button
        onClick={() => navigate(`/step/${step.id}`)}
        className={`w-full text-left rounded-xl border-2 p-4 card-hover ${
          completed
            ? 'border-success/30 bg-success/5'
            : 'border-border bg-card'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
            completed ? 'bg-success text-success-foreground' : 'bg-accent text-accent-foreground'
          }`}>
            {completed ? <Check className="h-4 w-4" /> : <span>{index != null ? index + 1 : step.priority}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {category && <span className="text-xs">{category.icon}</span>}
              <span className="text-xs font-medium text-muted-foreground">{category?.name[lang]}</span>
            </div>
            <p className={`font-semibold text-[15px] leading-snug ${completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {step.title[lang]}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{step.shortAction[lang]}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1.5" />
        </div>
      </button>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(step.id); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remove step"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
