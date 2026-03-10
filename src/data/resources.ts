import { LocalResource } from '@/types';

export const resources: LocalResource[] = [
  // Finland-wide
  { id: 'res-infopankki', categoryId: 'after_arrival', municipalityId: 'all', name: { en: 'InfoFinland', ru: 'InfoFinland' }, description: { en: 'Official guide for immigrants in Finland', ru: 'Официальный гид для иммигрантов в Финляндии' }, url: 'https://www.infofinland.fi/en' },
  { id: 'res-kela', categoryId: 'healthcare', municipalityId: 'all', name: { en: 'KELA Online Services', ru: 'Онлайн-сервисы KELA' }, description: { en: 'Apply for benefits and check decisions online', ru: 'Подавайте заявки на пособия и проверяйте решения онлайн' }, url: 'https://www.kela.fi/en' },
  { id: 'res-te', categoryId: 'work_employment', municipalityId: 'all', name: { en: 'Job Market Finland', ru: 'Рынок труда Финляндии' }, description: { en: 'Official job search portal', ru: 'Официальный портал поиска работы' }, url: 'https://www.te-palvelut.fi/en/' },
  { id: 'res-vero', categoryId: 'work_employment', municipalityId: 'all', name: { en: 'MyTax (OmaVero)', ru: 'OmaVero (Налоговый сервис)' }, description: { en: 'Finnish Tax Administration online service', ru: 'Онлайн-сервис Налогового управления Финляндии' }, url: 'https://www.vero.fi/en/' },
  { id: 'res-suomi', categoryId: 'documents_status', municipalityId: 'all', name: { en: 'Suomi.fi', ru: 'Suomi.fi' }, description: { en: 'Digital public services of Finland', ru: 'Цифровые государственные услуги Финляндии' }, url: 'https://www.suomi.fi/frontpage' },

  // Haapavesi-specific
  { id: 'res-haapavesi-city', categoryId: 'documents_status', municipalityId: 'haapavesi', name: { en: 'Haapavesi City Services', ru: 'Городские услуги Хаапавеси' }, description: { en: 'Official website of Haapavesi municipality', ru: 'Официальный сайт муниципалитета Хаапавеси' }, url: 'https://www.haapavesi.fi' },
  { id: 'res-haapavesi-library', categoryId: 'life_region', municipalityId: 'haapavesi', name: { en: 'Haapavesi Library', ru: 'Библиотека Хаапавеси' }, description: { en: 'Public library with free internet and Finnish language materials', ru: 'Публичная библиотека с бесплатным интернетом и материалами на финском' }, address: 'Kauppakaari 1, 86600 Haapavesi' },

  // Nivala-specific
  { id: 'res-nivala-city', categoryId: 'documents_status', municipalityId: 'nivala', name: { en: 'Nivala City Services', ru: 'Городские услуги Нивалы' }, description: { en: 'Official website of Nivala municipality', ru: 'Официальный сайт муниципалитета Нивала' }, url: 'https://www.nivala.fi' },

  // Ylivieska-specific
  { id: 'res-ylivieska-city', categoryId: 'documents_status', municipalityId: 'ylivieska', name: { en: 'Ylivieska City Services', ru: 'Городские услуги Юливиеска' }, description: { en: 'Official website of Ylivieska municipality', ru: 'Официальный сайт муниципалитета Юливиеска' }, url: 'https://www.ylivieska.fi' },
];
