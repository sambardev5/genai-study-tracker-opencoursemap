export type CourseLevel = "basic" | "amateur" | "professional" | "unknown";
export type UserCourseState =
  | "not_started"
  | "bookmarked"
  | "enrolled_external"
  | "in_progress"
  | "completed";
export type FreeVerificationStatus = "verified" | "suspected" | "unknown" | "expired";
export type SourceType = "rss" | "sitemap" | "api" | "manual" | "html_allowlisted";
export type SourceRunStatus = "queued" | "running" | "succeeded" | "failed" | "partial";
export type CandidateStatus = "new" | "parsed" | "rejected" | "needs_review" | "approved";

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  parentTopicId?: string | null;
  isActive: boolean;
}

export interface SkillDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  topicId: string;
  levelHint: Exclude<CourseLevel, "unknown">;
}

export interface Provider {
  id: string;
  name: string;
  websiteUrl: string;
  logoUrl?: string;
  providerType: "mooc" | "university" | "community" | "docs" | "video" | "other";
  isActive: boolean;
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  enrollmentUrl: string;
  providerId: string;
  topicIds: string[];
  skillIds: string[];
  difficulty: CourseLevel;
  durationHours: number | null;
  languageCode: string;
  isFree: boolean;
  freeVerificationStatus: FreeVerificationStatus;
  freeVerifiedAt: string;
  isActive: boolean;
  courseMode: "self-paced" | "live" | "cohort" | "hybrid" | "unknown";
  hasCertificate: boolean;
  certificateIsFree: boolean;
  instructorName: string;
  prerequisiteText?: string;
  syllabus?: string;
  imageUrl?: string;
  publishedAt: string;
}

export interface LearningPathItem {
  id: string;
  courseId: string;
  sequenceNo: number;
  isRequired: boolean;
  rationale: string;
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  targetLevel: Exclude<CourseLevel, "unknown">;
  topicId: string;
  isPublished: boolean;
  items: LearningPathItem[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline: string;
  currentLevel: Exclude<CourseLevel, "unknown">;
  weeklyStudyHours: number;
  avatarUrl?: string;
  isAdmin: boolean;
}

export interface UserPreferences {
  userId: string;
  goalText: string;
  preferredLevel: Exclude<CourseLevel, "unknown">;
  preferredLanguageCode: string;
  wantsCertificates: boolean;
  prefersSelfPaced: boolean;
  preferredTopics: string[];
  preferredProviders: string[];
}

export interface UserCourseStatus {
  id: string;
  userId: string;
  courseId: string;
  status: UserCourseState;
  percentComplete: number;
  enrolledAt?: string;
  startedAt?: string;
  completedAt?: string;
  completionEvidenceUrl?: string;
  completionNotes?: string;
  hoursSpent: number;
  rating?: number;
  updatedAt: string;
}

export interface TopicBreakdownItem {
  topicId: string;
  topicName: string;
  completed: number;
  inProgress: number;
}

export interface ProviderBreakdownItem {
  providerId: string;
  providerName: string;
  total: number;
}

export interface LevelBreakdownItem {
  level: Exclude<CourseLevel, "unknown">;
  total: number;
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  coverageScore: number;
  gapScore: number;
  recommendedCourseId?: string;
}

export interface RecommendationItem {
  courseId: string;
  score: number;
  reason: string;
}

export interface DashboardData {
  summary: {
    saved: number;
    started: number;
    completed: number;
    completionRate: number;
    hoursInvested: number;
    strongestTopic: string | null;
    weakestTopic: string | null;
  };
  statusDistribution: Array<{ name: UserCourseState; value: number }>;
  completionsOverTime: Array<{ date: string; completed: number }>;
  topicBreakdown: TopicBreakdownItem[];
  providerBreakdown: ProviderBreakdownItem[];
  levelBreakdown: LevelBreakdownItem[];
  skillGaps: SkillGapItem[];
  recommendedNext: RecommendationItem[];
}

export interface CourseSearchFilters {
  q?: string;
  topic?: string;
  provider?: string;
  pricing?: "all" | "free" | "paid";
  level?: Exclude<CourseLevel, "unknown">;
  language?: string;
  durationBucket?: "short" | "medium" | "long";
  certificate?: "yes" | "no" | "unknown";
  mode?: Course["courseMode"];
  page: number;
  pageSize: number;
  sort: "relevance" | "newest" | "duration_asc" | "duration_desc" | "popular";
}

export interface CourseSearchResult {
  items: Course[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  facets: {
    providers: Provider[];
    levels: Exclude<CourseLevel, "unknown">[];
    topics: Topic[];
  };
}

export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  sourceType: SourceType;
  parserKey: string;
  cadence: string;
  termsReviewed: boolean;
  robotsReviewed: boolean;
  enabled: boolean;
}

export interface SourceRun {
  id: string;
  sourceId: string;
  status: SourceRunStatus;
  startedAt?: string;
  finishedAt?: string;
  discoveredCount: number;
  insertedCount: number;
  updatedCount: number;
  rejectedCount: number;
  errorSummary?: string;
}

export interface RawCandidate {
  sourceId: string;
  url: string;
  title?: string;
  payload?: Record<string, unknown>;
}

export interface ParsedCourseCandidate {
  canonicalUrl: string;
  title: string;
  summary: string;
  providerName: string;
  topicSlugs: string[];
  difficulty: CourseLevel;
  durationHours?: number;
}

export interface ParsedRejection {
  rejected: true;
  reason: string;
}

export interface VerificationResult {
  isValid: boolean;
  isFree: boolean;
  freeVerificationStatus: FreeVerificationStatus;
  issues: string[];
}

export interface IngestionCandidate {
  id: string;
  sourceRunId?: string;
  discoveredUrl: string;
  canonicalUrl?: string;
  title?: string;
  parseStatus: CandidateStatus;
  confidenceScore: number;
  metadata: Record<string, unknown>;
  rejectionReason?: string;
}
