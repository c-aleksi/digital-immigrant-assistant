/**
 * Finland-wide starter content for seeding into the content_items table.
 * These are national-scope local_resource records covering 8 categories.
 * municipalityId = 'all' means Finland-wide.
 */
export const finlandWideSeedItems = [
  // === after_arrival ===
  {
    id: 'res-fw-infofinland-moving',
    content_type: 'local_resource',
    category: 'after_arrival',
    data: {
      id: 'res-fw-infofinland-moving',
      categoryId: 'after_arrival',
      municipalityId: 'all',
      name: { en: 'InfoFinland – Moving to Finland', ru: 'InfoFinland – Переезд в Финляндию' },
      description: {
        en: 'General guide for first steps after moving to Finland.',
        ru: 'Общий справочник по первым шагам после переезда в Финляндию.',
      },
      url: 'https://infofinland.fi/moving-to-finland',
    },
  },
  {
    id: 'res-fw-suomifi-guide',
    content_type: 'local_resource',
    category: 'after_arrival',
    data: {
      id: 'res-fw-suomifi-guide',
      categoryId: 'after_arrival',
      municipalityId: 'all',
      name: { en: 'Suomi.fi – Guide to Finland', ru: 'Suomi.fi – Гид по Финляндии' },
      description: {
        en: 'Official national guide to services and everyday life in Finland.',
        ru: 'Официальный национальный гид по услугам и повседневной жизни в Финляндии.',
      },
      url: 'https://www.suomi.fi/citizen',
    },
  },

  // === documents_status ===
  {
    id: 'res-fw-migri',
    content_type: 'local_resource',
    category: 'documents_status',
    data: {
      id: 'res-fw-migri',
      categoryId: 'documents_status',
      municipalityId: 'all',
      name: {
        en: 'Migri – Residence permits and immigration matters',
        ru: 'Migri – Вопросы вида на жительство и иммиграции',
      },
      description: {
        en: 'Official information about residence permits, immigration status, and related procedures.',
        ru: 'Официальная информация о видах на жительство, миграционном статусе и связанных процедурах.',
      },
      url: 'https://migri.fi/en/home',
    },
  },
  {
    id: 'res-fw-dvv',
    content_type: 'local_resource',
    category: 'documents_status',
    data: {
      id: 'res-fw-dvv',
      categoryId: 'documents_status',
      municipalityId: 'all',
      name: {
        en: 'DVV – Personal identity code and registration',
        ru: 'DVV – Персональный идентификационный код и регистрация',
      },
      description: {
        en: 'Official information about registration and personal identity code in Finland.',
        ru: 'Официальная информация о регистрации и персональном идентификационном коде в Финляндии.',
      },
      url: 'https://dvv.fi/en/personal-identity-code',
    },
  },
  {
    id: 'res-fw-police-id',
    content_type: 'local_resource',
    category: 'documents_status',
    data: {
      id: 'res-fw-police-id',
      categoryId: 'documents_status',
      municipalityId: 'all',
      name: {
        en: 'Police – Identity card services',
        ru: 'Полиция – Услуги по удостоверению личности',
      },
      description: {
        en: 'Official police services for identity card applications.',
        ru: 'Официальные услуги полиции по оформлению удостоверения личности.',
      },
      url: 'https://poliisi.fi/en/identity-card',
    },
  },
  {
    id: 'res-fw-ajovarma',
    content_type: 'local_resource',
    category: 'documents_status',
    data: {
      id: 'res-fw-ajovarma',
      categoryId: 'documents_status',
      municipalityId: 'all',
      name: {
        en: 'Ajovarma – Driving licence services',
        ru: 'Ajovarma – Услуги по водительским правам',
      },
      description: {
        en: 'Official services related to driving licence exchange and applications.',
        ru: 'Официальные услуги, связанные с обменом и оформлением водительских прав.',
      },
      url: 'https://www.ajovarma.fi/en/',
    },
  },

  // === family_children ===
  {
    id: 'res-fw-kela-families',
    content_type: 'local_resource',
    category: 'family_children',
    data: {
      id: 'res-fw-kela-families',
      categoryId: 'family_children',
      municipalityId: 'all',
      name: { en: 'Kela – Families with children', ru: 'Kela – Семьи с детьми' },
      description: {
        en: 'Official information about benefits and support for families with children.',
        ru: 'Официальная информация о пособиях и поддержке для семей с детьми.',
      },
      url: 'https://www.kela.fi/families',
    },
  },
  {
    id: 'res-fw-lastensuojelu',
    content_type: 'local_resource',
    category: 'family_children',
    data: {
      id: 'res-fw-lastensuojelu',
      categoryId: 'family_children',
      municipalityId: 'all',
      name: {
        en: 'Lastensuojelu.info – Services for families with children',
        ru: 'Lastensuojelu.info – Услуги для семей с детьми',
      },
      description: {
        en: 'General information about services for families with children in Finland.',
        ru: 'Общая информация об услугах для семей с детьми в Финляндии.',
      },
      url: 'https://lastensuojelu.info/en/',
    },
  },
  {
    id: 'res-fw-infofinland-daycare',
    content_type: 'local_resource',
    category: 'family_children',
    data: {
      id: 'res-fw-infofinland-daycare',
      categoryId: 'family_children',
      municipalityId: 'all',
      name: {
        en: 'InfoFinland – Early childhood education',
        ru: 'InfoFinland – Дошкольное образование',
      },
      description: {
        en: 'Overview of daycare and early childhood education in Finland.',
        ru: 'Обзор детских садов и дошкольного образования в Финляндии.',
      },
      url: 'https://infofinland.fi/en/family/children/day-care',
    },
  },

  // === work_employment ===
  {
    id: 'res-fw-jobmarket',
    content_type: 'local_resource',
    category: 'work_employment',
    data: {
      id: 'res-fw-jobmarket',
      categoryId: 'work_employment',
      municipalityId: 'all',
      name: { en: 'Job Market Finland', ru: 'Job Market Finland' },
      description: {
        en: 'Official national portal for job search and employment services.',
        ru: 'Официальный национальный портал для поиска работы и услуг занятости.',
      },
      url: 'https://tyomarkkinatori.fi/en',
    },
  },
  {
    id: 'res-fw-infofinland-work',
    content_type: 'local_resource',
    category: 'work_employment',
    data: {
      id: 'res-fw-infofinland-work',
      categoryId: 'work_employment',
      municipalityId: 'all',
      name: { en: 'InfoFinland – Work in Finland', ru: 'InfoFinland – Работа в Финляндии' },
      description: {
        en: 'General guidance on working in Finland.',
        ru: 'Общая информация о работе в Финляндии.',
      },
      url: 'https://infofinland.fi/en/work-and-enterprise/work-in-finland',
    },
  },
  {
    id: 'res-fw-vero',
    content_type: 'local_resource',
    category: 'work_employment',
    data: {
      id: 'res-fw-vero',
      categoryId: 'work_employment',
      municipalityId: 'all',
      name: {
        en: 'Vero – Tax card and taxation',
        ru: 'Vero – Налоговая карта и налогообложение',
      },
      description: {
        en: 'Official tax administration services and tax card information.',
        ru: 'Официальные услуги налоговой администрации и информация о налоговой карте.',
      },
      url: 'https://www.vero.fi/en/',
    },
  },

  // === education ===
  {
    id: 'res-fw-studyinfo',
    content_type: 'local_resource',
    category: 'education',
    data: {
      id: 'res-fw-studyinfo',
      categoryId: 'education',
      municipalityId: 'all',
      name: { en: 'Studyinfo', ru: 'Studyinfo' },
      description: {
        en: 'Official portal for studies and applying to education in Finland.',
        ru: 'Официальный портал по обучению и поступлению в Финляндии.',
      },
      url: 'https://opintopolku.fi/konfo/en/',
    },
  },
  {
    id: 'res-fw-oph',
    content_type: 'local_resource',
    category: 'education',
    data: {
      id: 'res-fw-oph',
      categoryId: 'education',
      municipalityId: 'all',
      name: {
        en: 'Finnish National Agency for Education',
        ru: 'Национальное агентство образования Финляндии',
      },
      description: {
        en: 'Official information about the Finnish education system.',
        ru: 'Официальная информация о системе образования Финляндии.',
      },
      url: 'https://www.oph.fi/en',
    },
  },

  // === healthcare ===
  {
    id: 'res-fw-infofinland-health',
    content_type: 'local_resource',
    category: 'healthcare',
    data: {
      id: 'res-fw-infofinland-health',
      categoryId: 'healthcare',
      municipalityId: 'all',
      name: {
        en: 'InfoFinland – Health services',
        ru: 'InfoFinland – Медицинские услуги',
      },
      description: {
        en: 'General guide to health services in Finland.',
        ru: 'Общий справочник по медицинским услугам в Финляндии.',
      },
      url: 'https://infofinland.fi/en/health',
    },
  },
  {
    id: 'res-fw-kela-health',
    content_type: 'local_resource',
    category: 'healthcare',
    data: {
      id: 'res-fw-kela-health',
      categoryId: 'healthcare',
      municipalityId: 'all',
      name: {
        en: 'Kela – Healthcare and social security',
        ru: 'Kela – Здравоохранение и социальное обеспечение',
      },
      description: {
        en: 'Official information about health-related social security and reimbursements.',
        ru: 'Официальная информация о медицинском социальном обеспечении и компенсациях.',
      },
      url: 'https://www.kela.fi/',
    },
  },

  // === safety ===
  {
    id: 'res-fw-112',
    content_type: 'local_resource',
    category: 'safety',
    data: {
      id: 'res-fw-112',
      categoryId: 'safety',
      municipalityId: 'all',
      name: { en: '112 Finland', ru: '112 Финляндия' },
      description: {
        en: 'Official emergency information and national emergency number.',
        ru: 'Официальная информация об экстренной помощи и национальном номере 112.',
      },
      url: 'https://112.fi/en/',
    },
  },
  {
    id: 'res-fw-thl-shelter',
    content_type: 'local_resource',
    category: 'safety',
    data: {
      id: 'res-fw-thl-shelter',
      categoryId: 'safety',
      municipalityId: 'all',
      name: {
        en: 'THL – Shelter and crisis services',
        ru: 'THL – Приюты и кризисные услуги',
      },
      description: {
        en: 'National information about shelter and crisis support services.',
        ru: 'Национальная информация о приютах и кризисной поддержке.',
      },
      url: 'https://thl.fi/en/web/thlfi-en',
    },
  },

  // === life_region ===
  {
    id: 'res-fw-infofinland-everyday',
    content_type: 'local_resource',
    category: 'life_region',
    data: {
      id: 'res-fw-infofinland-everyday',
      categoryId: 'life_region',
      municipalityId: 'all',
      name: {
        en: 'InfoFinland – Everyday life in Finland',
        ru: 'InfoFinland – Повседневная жизнь в Финляндии',
      },
      description: {
        en: 'General guidance about everyday services and daily life in Finland.',
        ru: 'Общая информация о повседневных услугах и жизни в Финляндии.',
      },
      url: 'https://infofinland.fi/en/information-about-finland/everyday-life-in-finland',
    },
  },
  {
    id: 'res-fw-infofinland-society',
    content_type: 'local_resource',
    category: 'life_region',
    data: {
      id: 'res-fw-infofinland-society',
      categoryId: 'life_region',
      municipalityId: 'all',
      name: {
        en: 'InfoFinland – Finnish society and integration',
        ru: 'InfoFinland – Финское общество и интеграция',
      },
      description: {
        en: 'General information about integration and living in Finnish society.',
        ru: 'Общая информация об интеграции и жизни в финском обществе.',
      },
      url: 'https://infofinland.fi/en/information-about-finland/finnish-society',
    },
  },
];
