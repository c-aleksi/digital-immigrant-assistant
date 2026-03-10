import { Language } from '@/types';

const translations: Record<string, Record<Language, string>> = {
  // Welcome
  'welcome.title': { en: 'Digital Immigrant Assistant', ru: 'Цифровой помощник иммигранта' },
  'welcome.subtitle': { en: 'Your personal guide to settling in Finland', ru: 'Ваш персональный гид по обустройству в Финляндии' },
  'welcome.description': { en: 'Choose your language to get started', ru: 'Выберите язык для начала' },
  'welcome.cta': { en: 'Continue', ru: 'Продолжить' },

  // Onboarding
  'onboarding.scenario.title': { en: 'What describes you best?', ru: 'Что лучше всего вас описывает?' },
  'onboarding.scenario.subtitle': { en: 'This helps us personalize your route', ru: 'Это поможет персонализировать ваш маршрут' },
  'onboarding.municipality.title': { en: 'Select your municipality', ru: 'Выберите вашу муниципалитет' },
  'onboarding.municipality.subtitle': { en: 'We will show local resources and contacts', ru: 'Мы покажем местные ресурсы и контакты' },
  'onboarding.municipality.placeholder': { en: 'Select a city…', ru: 'Выберите город…' },
  'onboarding.municipality.search': { en: 'Search city…', ru: 'Поиск города…' },
  'onboarding.municipality.noResults': { en: 'No cities found', ru: 'Города не найдены' },
  'onboarding.email.title': { en: 'Stay informed (optional)', ru: 'Будьте в курсе (необязательно)' },
  'onboarding.email.subtitle': { en: 'Get updates about new resources in your area', ru: 'Получайте обновления о новых ресурсах в вашем районе' },
  'onboarding.email.placeholder': { en: 'your@email.com', ru: 'ваш@email.com' },
  'onboarding.email.consent': { en: 'I agree to receive informational messages', ru: 'Я согласен получать информационные сообщения' },
  'onboarding.email.skip': { en: 'Skip for now', ru: 'Пропустить' },
  'onboarding.email.continue': { en: 'Continue with email', ru: 'Продолжить с email' },
  'onboarding.email.errorEmpty': { en: 'Please enter your email address', ru: 'Пожалуйста, введите ваш email' },
  'onboarding.email.errorInvalid': { en: 'Please enter a valid email address', ru: 'Пожалуйста, введите корректный email' },

  // Dashboard
  'dashboard.welcome': { en: 'Welcome!', ru: 'Добро пожаловать!' },
  'dashboard.yourRoute': { en: 'Your personal route', ru: 'Ваш персональный маршрут' },
  'dashboard.nextSteps': { en: 'Next steps', ru: 'Следующие шаги' },
  'dashboard.progress': { en: 'Progress', ru: 'Прогресс' },
  'dashboard.completed': { en: 'completed', ru: 'выполнено' },
  'dashboard.quickAccess': { en: 'Quick access', ru: 'Быстрый доступ' },
  'dashboard.showMore': { en: '+{n} more steps', ru: '+{n} ещё шагов' },

  // Navigation
  'nav.dashboard': { en: 'Home', ru: 'Главная' },
  'nav.resources': { en: 'Resources', ru: 'Ресурсы' },
  'nav.search': { en: 'Search', ru: 'Поиск' },
  'nav.contacts': { en: 'Contacts', ru: 'Контакты' },
  'nav.profile': { en: 'Profile', ru: 'Профиль' },

  // Common
  'common.back': { en: 'Back', ru: 'Назад' },
  'common.continue': { en: 'Continue', ru: 'Продолжить' },
  'common.save': { en: 'Save', ru: 'Сохранить' },
  'common.cancel': { en: 'Cancel', ru: 'Отмена' },
  'common.markDone': { en: 'Mark as completed', ru: 'Отметить выполненным' },
  'common.markUndone': { en: 'Mark as not completed', ru: 'Отметить невыполненным' },
  'common.localInfo': { en: 'Local information', ru: 'Местная информация' },
  'common.finlandWide': { en: 'Finland-wide information', ru: 'Информация по всей Финляндии' },
  'common.relatedArticles': { en: 'Related articles', ru: 'Связанные статьи' },
  'common.relatedContacts': { en: 'Related contacts', ru: 'Связанные контакты' },
  'common.officialLinks': { en: 'Official links', ru: 'Официальные ссылки' },
  'common.noResults': { en: 'No results found', ru: 'Результаты не найдены' },

  // Fallback
  'fallback.title': { en: 'Local information is being prepared', ru: 'Местная информация готовится' },
  'fallback.message': { en: 'Verified local data for this section is currently being collected. Below you can find general Finland-wide information on this topic.', ru: 'Проверенные местные данные для этого раздела собираются. Ниже вы найдёте общую информацию по Финляндии на эту тему.' },

  // Search
  'search.title': { en: 'Search', ru: 'Поиск' },
  'search.placeholder': { en: 'Search steps, articles, resources…', ru: 'Поиск шагов, статей, ресурсов…' },
  'search.filter.all': { en: 'All', ru: 'Все' },
  'search.filter.steps': { en: 'Steps', ru: 'Шаги' },
  'search.filter.articles': { en: 'Articles', ru: 'Статьи' },
  'search.filter.resources': { en: 'Resources', ru: 'Ресурсы' },
  'search.filter.contacts': { en: 'Contacts', ru: 'Контакты' },

  // Profile
  'profile.title': { en: 'Profile & Settings', ru: 'Профиль и настройки' },
  'profile.language': { en: 'Language', ru: 'Язык' },
  'profile.scenario': { en: 'Scenario', ru: 'Сценарий' },
  'profile.municipality': { en: 'Municipality', ru: 'Муниципалитет' },
  'profile.email': { en: 'Email', ru: 'Email' },
  'profile.consent': { en: 'Consent to messages', ru: 'Согласие на сообщения' },
  'profile.progress': { en: 'Progress', ru: 'Прогресс' },
  'profile.resetProgress': { en: 'Reset progress', ru: 'Сбросить прогресс' },
  'profile.resetAll': { en: 'Reset all settings', ru: 'Сбросить все настройки' },
  'profile.yes': { en: 'Yes', ru: 'Да' },
  'profile.no': { en: 'No', ru: 'Нет' },
  'profile.notProvided': { en: 'Not provided', ru: 'Не указан' },

  // Library
  'library.title': { en: 'Library', ru: 'Библиотека' },
  'library.heading': { en: 'Bundle Library', ru: 'Библиотека наборов' },
  'library.subtitle': { en: 'Browse and add step collections to your feed', ru: 'Просматривайте и добавляйте наборы шагов' },
  'library.onboardingSection': { en: 'Onboarding Bundles', ru: 'Стартовые наборы' },
  'library.guidesSection': { en: 'Guides & Collections', ru: 'Гайды и подборки' },
  'library.backToList': { en: 'Back to library', ru: 'Назад к библиотеке' },
  'library.addBundle': { en: 'Add to my feed', ru: 'Добавить в мою ленту' },
  'library.removeBundle': { en: 'Remove from feed', ru: 'Удалить из ленты' },
  'library.alreadyAdded': { en: 'Already in your feed', ru: 'Уже в вашей ленте' },
  'library.includedSteps': { en: 'Included steps', ru: 'Входящие шаги' },
  'library.empty': { en: 'No bundles available yet', ru: 'Наборы пока недоступны' },
  'library.noStepsYet': { en: 'Steps for this bundle are being prepared', ru: 'Шаги для этого набора готовятся' },
  'library.toastAdded': { en: '"{name}" added to your steps', ru: '«{name}» добавлен в ваши шаги' },
  'library.toastRemoved': { en: '"{name}" removed from your steps', ru: '«{name}» удалён из ваших шагов' },
  'library.browse': { en: 'Browse guides & collections', ru: 'Гайды и подборки шагов' },
  'nav.library': { en: 'Library', ru: 'Библиотека' },

  // Feed (Next Steps)
  'feed.stepRemoved': { en: 'Step removed from your feed', ru: 'Шаг удалён из вашей ленты' },
  'feed.swipeHint': { en: 'hover to remove', ru: 'наведите для удаления' },
  'feed.empty': { en: 'No steps yet. Add a guide from the library!', ru: 'Шагов пока нет. Добавьте набор из библиотеки!' },

  // Resources
  'resources.title': { en: 'Local Resources', ru: 'Местные ресурсы' },

  // Contacts
  'contacts.title': { en: 'Contacts & Support', ru: 'Контакты и поддержка' },
  'contacts.emergency': { en: 'Emergency', ru: 'Экстренные' },
  'contacts.local': { en: 'Local contacts', ru: 'Местные контакты' },
  'contacts.general': { en: 'General contacts', ru: 'Общие контакты' },
};

export function t(key: string, lang: Language): string {
  return translations[key]?.[lang] ?? key;
}
