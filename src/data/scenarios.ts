import { Scenario } from '@/types';

export const scenarios: Scenario[] = [
  {
    id: 'family_with_children',
    name: { en: 'Family with children', ru: 'Семья с детьми' },
    description: { en: 'Daycare, schools, child benefits, family services', ru: 'Детский сад, школы, пособия на детей, семейные услуги' },
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'new_resident',
    name: { en: 'New resident', ru: 'Новый житель' },
    description: { en: 'Registration, ID, banking, first steps', ru: 'Регистрация, ID, банк, первые шаги' },
    icon: '🏠',
  },
  {
    id: 'working_or_looking_for_work',
    name: { en: 'Working or looking for work', ru: 'Работающий или ищущий работу' },
    description: { en: 'Employment, TE services, tax card, contracts', ru: 'Трудоустройство, TE-услуги, налоговая карта, контракты' },
    icon: '💼',
  },
  {
    id: 'student',
    name: { en: 'Student', ru: 'Студент' },
    description: { en: 'Study permits, KELA, student housing, integration', ru: 'Учебные разрешения, KELA, студенческое жильё, интеграция' },
    icon: '🎓',
  },
  {
    id: 'general',
    name: { en: 'General information', ru: 'Общая информация' },
    description: { en: 'Browse all topics without a specific scenario', ru: 'Просмотр всех тем без конкретного сценария' },
    icon: '📋',
  },
];
