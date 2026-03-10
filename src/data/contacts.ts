import { ContactPoint } from '@/types';

export const contacts: ContactPoint[] = [
  // Emergency → safety
  { id: 'contact-emergency', categoryId: 'safety', municipalityId: 'all', name: { en: 'Emergency number', ru: 'Экстренный номер' }, description: { en: 'For emergencies: fire, police, ambulance', ru: 'Для экстренных случаев: пожар, полиция, скорая' }, phone: '112', isEmergency: true },
  { id: 'contact-crisis', categoryId: 'safety', municipalityId: 'all', name: { en: 'Crisis helpline', ru: 'Кризисная линия помощи' }, description: { en: 'Mental health crisis support', ru: 'Поддержка в кризисных ситуациях' }, phone: '09 2525 0111', isEmergency: true },

  // Finland-wide
  { id: 'contact-dvv', categoryId: 'documents_status', municipalityId: 'all', name: { en: 'DVV Customer Service', ru: 'Служба поддержки DVV' }, description: { en: 'Population register services', ru: 'Услуги реестра населения' }, phone: '+358 295 536 000', url: 'https://dvv.fi/en' },
  { id: 'contact-kela', categoryId: 'healthcare', municipalityId: 'all', name: { en: 'KELA Customer Service', ru: 'Служба поддержки KELA' }, description: { en: 'Benefits and social insurance', ru: 'Пособия и социальное страхование' }, phone: '+358 20 634 0200', url: 'https://www.kela.fi/en' },
  { id: 'contact-te', categoryId: 'work_employment', municipalityId: 'all', name: { en: 'TE Services', ru: 'TE-служба' }, description: { en: 'Employment and integration services', ru: 'Службы занятости и интеграции' }, phone: '+358 295 025 500', url: 'https://www.te-palvelut.fi/en/' },

  // Haapavesi
  { id: 'contact-haapavesi-health', categoryId: 'healthcare', municipalityId: 'haapavesi', name: { en: 'Haapavesi Health Center', ru: 'Поликлиника Хаапавеси' }, description: { en: 'Municipal health services', ru: 'Муниципальные медицинские услуги' }, phone: '+358 44 7591 300', address: 'Terveyskeskuksentie 1, 86600 Haapavesi' },
  { id: 'contact-haapavesi-city', categoryId: 'documents_status', municipalityId: 'haapavesi', name: { en: 'Haapavesi City Hall', ru: 'Администрация Хаапавеси' }, description: { en: 'Municipal administration', ru: 'Муниципальная администрация' }, phone: '+358 8 459 5111', email: 'kirjaamo@haapavesi.fi' },

  // Nivala
  { id: 'contact-nivala-city', categoryId: 'documents_status', municipalityId: 'nivala', name: { en: 'Nivala City Hall', ru: 'Администрация Нивалы' }, description: { en: 'Municipal administration', ru: 'Муниципальная администрация' }, phone: '+358 8 410 9111', url: 'https://www.nivala.fi' },
];
