import { ReferenceArticle } from '@/types';

export const articles: ReferenceArticle[] = [
  {
    id: 'article-henkilotunnus',
    categoryId: 'documents_status',
    scenarios: ['family_with_children', 'new_resident', 'working_or_looking_for_work', 'student', 'general'],
    municipalityId: 'all',
    title: { en: 'What is henkilötunnus?', ru: 'Что такое henkilötunnus?' },
    summary: { en: 'Finnish personal identity code explained', ru: 'Финский персональный идентификационный код' },
    content: {
      en: 'Henkilötunnus is a personal identity code assigned to every person registered in Finland. It consists of your birth date, a dash or letter, and a three-digit individual number plus a check character.\n\nYou receive it when you register at DVV. It is required for opening a bank account, getting a tax card, accessing healthcare, and most other official services.\n\nKeep your henkilötunnus private — it is used for identification and should not be shared publicly.',
      ru: 'Henkilötunnus — это персональный идентификационный код, присваиваемый каждому зарегистрированному в Финляндии. Он состоит из даты рождения, дефиса или буквы, трёхзначного номера и контрольного символа.\n\nВы получаете его при регистрации в DVV. Он необходим для открытия банковского счёта, получения налоговой карты, доступа к здравоохранению и большинства других официальных услуг.\n\nХраните henkilötunnus в тайне — он используется для идентификации и не должен публиковаться.',
    },
    officialLinks: [{ label: { en: 'DVV – Personal identity code', ru: 'DVV – Персональный код' }, url: 'https://dvv.fi/en/personal-identity-code' }],
  },
  {
    id: 'article-kela-overview',
    categoryId: 'healthcare',
    scenarios: ['family_with_children', 'new_resident', 'working_or_looking_for_work', 'student', 'general'],
    municipalityId: 'all',
    title: { en: 'KELA benefits overview', ru: 'Обзор пособий KELA' },
    summary: { en: 'What benefits KELA provides and who is eligible', ru: 'Какие пособия предоставляет KELA и кто имеет право' },
    content: {
      en: 'KELA (Social Insurance Institution of Finland) provides a wide range of benefits including healthcare reimbursements, housing allowance, child benefits, student financial aid, unemployment benefits, and basic social assistance.\n\nTo be eligible, you typically need to be registered as a resident in Finland. Some benefits require additional conditions such as employment, study enrollment, or specific family situations.',
      ru: 'KELA (Ведомство социального страхования Финляндии) предоставляет широкий спектр пособий, включая компенсации за медицинские расходы, жилищное пособие, детские пособия, студенческую финансовую помощь, пособие по безработице и базовую социальную помощь.\n\nДля получения обычно требуется регистрация в качестве резидента Финляндии. Некоторые пособия требуют дополнительных условий.',
    },
    officialLinks: [{ label: { en: 'KELA website', ru: 'Сайт KELA' }, url: 'https://www.kela.fi/en' }],
  },
  {
    id: 'article-healthcare-system',
    categoryId: 'healthcare',
    scenarios: ['family_with_children', 'new_resident', 'working_or_looking_for_work', 'student', 'general'],
    municipalityId: 'all',
    title: { en: 'Finnish healthcare system', ru: 'Система здравоохранения Финляндии' },
    summary: { en: 'How healthcare works in Finland', ru: 'Как работает здравоохранение в Финляндии' },
    content: {
      en: 'Finland has a public healthcare system organized by municipalities. Each municipality has a health center (terveyskeskus) where you can access general medical services at a low cost.\n\nYou need to register at the health center in your municipality. Emergency care is available to everyone regardless of registration status. Specialist care requires a referral from a general practitioner.',
      ru: 'Финляндия имеет систему государственного здравоохранения, организованную по муниципалитетам. В каждом муниципалитете есть поликлиника (terveyskeskus), где вы можете получить медицинские услуги по низкой цене.\n\nВам нужно зарегистрироваться в поликлинике вашего муниципалитета. Экстренная помощь доступна всем. Специализированная помощь требует направления от терапевта.',
    },
  },
  {
    id: 'article-integration-plan',
    categoryId: 'education',
    scenarios: ['new_resident', 'working_or_looking_for_work', 'general'],
    municipalityId: 'all',
    title: { en: 'Integration plan (kotoutumissuunnitelma)', ru: 'План интеграции (kotoutumissuunnitelma)' },
    summary: { en: 'Your personal integration plan in Finland', ru: 'Ваш персональный план интеграции в Финляндии' },
    content: {
      en: 'When you register as a job seeker, you are entitled to an integration plan. This plan is made together with a TE Services counselor and includes Finnish language courses, employment support, and other integration activities.\n\nThe plan typically covers a period of 1-3 years. During this time, you may receive integration allowance while participating in planned activities.',
      ru: 'Когда вы регистрируетесь как ищущий работу, вы имеете право на план интеграции. Этот план составляется вместе с консультантом TE-службы и включает курсы финского языка, поддержку трудоустройства и другие интеграционные мероприятия.\n\nПлан обычно охватывает период 1-3 года. В это время вы можете получать пособие по интеграции.',
    },
  },
];
