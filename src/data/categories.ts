import { Category } from '@/types';

/**
 * Canonical 8-category taxonomy used across the entire application.
 * All content (database, admin, static fallback) references these IDs.
 */
export const categories: Category[] = [
  { id: 'after_arrival', name: { en: 'After arrival', ru: 'После переезда' }, icon: '✈️', order: 1 },
  { id: 'documents_status', name: { en: 'Documents and status', ru: 'Документы и статус' }, icon: '📄', order: 2 },
  { id: 'family_children', name: { en: 'Family and children', ru: 'Семья и дети' }, icon: '👨‍👩‍👧', order: 3 },
  { id: 'work_employment', name: { en: 'Work and employment', ru: 'Работа и трудоустройство' }, icon: '🔧', order: 4 },
  { id: 'education', name: { en: 'Education', ru: 'Образование' }, icon: '📚', order: 5 },
  { id: 'healthcare', name: { en: 'Healthcare', ru: 'Здравоохранение' }, icon: '⚕️', order: 6 },
  { id: 'safety', name: { en: 'Safety', ru: 'Безопасность' }, icon: '🛡️', order: 7 },
  { id: 'life_region', name: { en: 'Life in the region', ru: 'Жизнь в регионе' }, icon: '🏘️', order: 8 },
];

/**
 * Legacy-to-canonical mapping. Used only as a temporary compatibility helper
 * for any code that may still reference old category IDs during transition.
 */
export const legacyCategoryMapping: Record<string, string> = {
  registration: 'documents_status',
  housing: 'life_region',
  work: 'work_employment',
  health: 'healthcare',
  family: 'family_children',
  finance: 'documents_status', // default; context-specific items mapped individually
  transport: 'life_region',
  language: 'education',
  social: 'life_region',
};
