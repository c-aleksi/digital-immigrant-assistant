export type Language = 'en' | 'ru';
export type ScenarioId = 'family_with_children' | 'new_resident' | 'working_or_looking_for_work' | 'student' | 'general';
export type MunicipalityId = 'nivala' | 'ylivieska' | 'haapajarvi' | 'haapavesi' | 'alavieska' | 'sievi';
export type CategoryId = 'after_arrival' | 'documents_status' | 'family_children' | 'work_employment' | 'education' | 'healthcare' | 'safety' | 'life_region';

export interface Municipality {
  id: MunicipalityId;
  name: Record<Language, string>;
  population?: number;
  region: string;
}

export interface Scenario {
  id: ScenarioId;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
}

export interface Category {
  id: CategoryId;
  name: Record<Language, string>;
  icon: string;
  order: number;
}

// === Extended RouteStep with optional new fields (backward compatible) ===
export interface RouteStep {
  id: string;
  categoryId: CategoryId;
  scenarios: ScenarioId[];
  municipalityId: MunicipalityId | 'all';
  priority: number;
  title: Record<Language, string>;
  shortAction: Record<Language, string>;
  description: Record<Language, string>;
  officialLinks?: { label: Record<Language, string>; url: string }[];
  relatedArticleIds?: string[];
  relatedContactIds?: string[];
  // --- New optional fields for two-layer model ---
  slug?: string;
  secondaryCategories?: CategoryId[];
  statusTags?: string[];
  estimatedTime?: string;
  prerequisites?: string[];
  stepBundleId?: string;
  isRecommendedByDefault?: boolean;
  canBeAddedByUser?: boolean;
  canBeRemovedByUser?: boolean;
  defaultOrder?: number;
  visibilityInLibrary?: boolean;
}

export interface ReferenceArticle {
  id: string;
  categoryId: CategoryId;
  scenarios: ScenarioId[];
  municipalityId: MunicipalityId | 'all';
  title: Record<Language, string>;
  summary: Record<Language, string>;
  content: Record<Language, string>;
  officialLinks?: { label: Record<Language, string>; url: string }[];
}

export interface LocalResource {
  id: string;
  categoryId: CategoryId;
  municipalityId: MunicipalityId | 'all';
  name: Record<Language, string>;
  description: Record<Language, string>;
  url?: string;
  address?: string;
  phone?: string;
}

export interface ContactPoint {
  id: string;
  categoryId: CategoryId;
  municipalityId: MunicipalityId | 'all';
  name: Record<Language, string>;
  description: Record<Language, string>;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  isEmergency?: boolean;
}

export interface FallbackContent {
  categoryId: CategoryId;
  municipalityId: MunicipalityId;
  message: Record<Language, string>;
}

// === New entity: Step Bundle (group of related steps) ===
// === Bundle: the canonical grouping entity (replaces old StepBundle) ===
export type BundleType = 'onboarding' | 'guide' | 'thematic';

export interface Bundle {
  id: string;
  bundleType: BundleType;
  name: Record<string, string>;
  description: Record<string, string>;
  icon?: string;
  priority?: number;
  // Visibility & behavior flags
  useInOnboarding?: boolean;
  visibilityInLibrary?: boolean;
  isRecommendedByDefault?: boolean;
  canBeAddedByUser?: boolean;
  canBeRemovedByUser?: boolean;
  // Scope
  scope?: 'national' | 'municipal';
  municipalityId?: MunicipalityId | 'all';
  // Legacy compat: which old scenarios this bundle maps to
  legacyScenarioId?: ScenarioId;
  scenarios?: ScenarioId[];
  // Composition is managed via content_relations table
}

/** @deprecated Use Bundle instead. Kept for backward compatibility. */
export interface StepBundle {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  scenarios: ScenarioId[];
  scope: 'national' | 'municipal';
  municipalityId?: MunicipalityId;
  stepIds: string[];
  priority?: number;
  icon?: string;
}

// === New entity: Content Relation (bundle ↔ step join) ===
export interface ContentRelation {
  id: string;
  parentId: string;
  childId: string;
  relationType: 'bundle_step' | 'guide_card_step' | 'article_step';
  position: number;
}

// === New entity: User Feed Entry (Layer 2) ===
export type FeedSourceType = 'default_scenario' | 'user_added' | 'bundle_added' | 'admin_assigned';

export interface UserFeedEntry {
  id: string;
  userId: string;
  contentItemId: string;
  sourceType: FeedSourceType;
  displayOrder: number;
  isCompleted: boolean;
  isHidden: boolean;
  addedAt: string;
  updatedAt: string;
}

export interface UserContext {
  language: Language;
  /** @deprecated Use selectedBundleIds instead. Kept for backward compat. */
  scenario: ScenarioId | null;
  municipality: MunicipalityId | null;
  email: string | null;
  consent: boolean;
  onboardingCompleted: boolean;
  /** Bundle-first: IDs of bundles the user has selected (onboarding + manually added) */
  selectedBundleIds: string[];
  /** Step IDs the user has manually removed from their personal feed */
  hiddenStepIds: string[];
}

export interface UserProgress {
  completedStepIds: string[];
}
