import { formatISO } from "date-fns";
import {
  demoPreferences,
  demoProfile,
  getCatalogCourses,
  getCatalogLearningPaths,
  getCatalogProviders,
  ingestionCandidates,
  skills,
  sourceRuns,
  sources,
  topics,
  userCourseStatuses,
} from "@/lib/db/demo-data";
import { getTopRecommendations } from "@/lib/recommendations/engine";
import { computeSkillGap } from "@/lib/recommendations/skill-gap";
import { computeQueryScore } from "@/lib/search/ranking";
import { getDurationBucket, slugify } from "@/lib/utils";
import type {
  Course,
  CourseSearchFilters,
  CourseSearchResult,
  DashboardData,
  LearningPath,
  Provider,
  Topic,
  UserCourseState,
  UserCourseStatus,
  UserPreferences,
  UserProfile,
} from "@/lib/types";

const profileStore = new Map<string, UserProfile>([[demoProfile.id, demoProfile]]);
const preferenceStore = new Map<string, UserPreferences>([[demoPreferences.userId, demoPreferences]]);

function getVisibleCourses(pricing: NonNullable<CourseSearchFilters["pricing"]> = "free") {
  return getCatalogCourses().filter((course) => {
    if (!course.isActive) {
      return false;
    }

    if (pricing === "free") {
      return course.isFree;
    }

    if (pricing === "paid") {
      return !course.isFree;
    }

    return true;
  });
}

function getProviderById(providerId: string) {
  return getCatalogProviders().find((provider) => provider.id === providerId) ?? null;
}

function compareDurations(left: Course, right: Course, direction: "asc" | "desc") {
  const leftDuration = left.durationHours;
  const rightDuration = right.durationHours;

  if (leftDuration == null && rightDuration == null) {
    return 0;
  }

  if (leftDuration == null) {
    return 1;
  }

  if (rightDuration == null) {
    return -1;
  }

  return direction === "asc" ? leftDuration - rightDuration : rightDuration - leftDuration;
}

function getTopicById(topicId: string) {
  return topics.find((topic) => topic.id === topicId) ?? null;
}

function sortCourses(items: Course[], filters: CourseSearchFilters) {
  return [...items].sort((left, right) => {
    if (filters.sort === "newest") {
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    }

    if (filters.sort === "duration_asc") {
      return compareDurations(left, right, "asc");
    }

    if (filters.sort === "duration_desc") {
      return compareDurations(left, right, "desc");
    }

    const rightScore = computeQueryScore(right, filters.q);
    const leftScore = computeQueryScore(left, filters.q);

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    return new Date(right.freeVerifiedAt).getTime() - new Date(left.freeVerifiedAt).getTime();
  });
}

function filterCourses(filters: CourseSearchFilters) {
  return getVisibleCourses(filters.pricing ?? "all").filter((course) => {
    if (filters.q && computeQueryScore(course, filters.q) === 0) {
      return false;
    }

    if (filters.topic && !course.topicIds.includes(filters.topic)) {
      return false;
    }

    if (filters.provider && course.providerId !== filters.provider) {
      return false;
    }

    if (filters.level && course.difficulty !== filters.level) {
      return false;
    }

    if (filters.language && course.languageCode !== filters.language) {
      return false;
    }

    if (filters.durationBucket && getDurationBucket(course.durationHours) !== filters.durationBucket) {
      return false;
    }

    if (filters.certificate === "yes" && !course.hasCertificate) {
      return false;
    }

    if (filters.certificate === "no" && course.hasCertificate) {
      return false;
    }

    if (filters.mode && course.courseMode !== filters.mode) {
      return false;
    }

    return true;
  });
}

function getUserStatuses(userId: string) {
  return userCourseStatuses.filter((status) => status.userId === userId);
}

function findCourse(courseId: string) {
  return getCatalogCourses().find((course) => course.id === courseId) ?? null;
}

function getPathCourses(path: LearningPath) {
  return path.items
    .sort((left, right) => left.sequenceNo - right.sequenceNo)
    .map((item) => ({
      ...item,
      course: findCourse(item.courseId),
    }));
}

function defaultProfile(userId: string): UserProfile {
  return {
    id: userId,
    email: "",
    fullName: "Learner",
    headline: "",
    currentLevel: "basic",
    weeklyStudyHours: 0,
    avatarUrl: "",
    isAdmin: false,
  };
}

function defaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    goalText: "",
    preferredLevel: "basic",
    preferredLanguageCode: "en",
    wantsCertificates: false,
    prefersSelfPaced: true,
    preferredTopics: [],
    preferredProviders: [],
  };
}

export const repository = {
  getTopics(): Topic[] {
    return topics.filter((topic) => topic.isActive);
  },

  getTopicBySlug(slug: string): Topic | null {
    return topics.find((topic) => topic.slug === slug && topic.isActive) ?? null;
  },

  getProviders(): Provider[] {
    return getCatalogProviders().filter((provider) => provider.isActive);
  },

  listCourses(filters: CourseSearchFilters): CourseSearchResult {
    const filtered = sortCourses(filterCourses(filters), filters);
    const totalPages = Math.max(1, Math.ceil(filtered.length / filters.pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * filters.pageSize;
    const paged = filtered.slice(start, start + filters.pageSize);
    const topicFacetIds = new Set(filtered.flatMap((course) => course.topicIds));
    const providerFacetIds = new Set(filtered.map((course) => course.providerId));
    const providers = getCatalogProviders();

    return {
      items: paged,
      pagination: {
        page,
        pageSize: filters.pageSize,
        total: filtered.length,
        totalPages,
      },
      facets: {
        providers: providers.filter((provider) => providerFacetIds.has(provider.id)),
        levels: ["basic", "amateur", "professional"].filter((level) =>
          filtered.some((course) => course.difficulty === level),
        ) as Array<"basic" | "amateur" | "professional">,
        topics: topics.filter((topic) => topicFacetIds.has(topic.id)),
      },
    };
  },

  getCourseById(id: string) {
    const course = findCourse(id);

    if (!course) {
      return null;
    }

    const related = getVisibleCourses("all")
      .filter(
        (candidate) =>
          candidate.id !== course.id &&
          candidate.topicIds.some((topicId) => course.topicIds.includes(topicId)),
      )
      .slice(0, 3);

    return {
      ...course,
      provider: getProviderById(course.providerId),
      topics: course.topicIds.map(getTopicById).filter((topic): topic is Topic => Boolean(topic)),
      related,
    };
  },

  getLearningPaths() {
    return getCatalogLearningPaths().filter((path) => path.isPublished);
  },

  getLearningPathBySlug(slug: string) {
    const path = getCatalogLearningPaths().find(
      (learningPath) => learningPath.slug === slug && learningPath.isPublished,
    );

    if (!path) {
      return null;
    }

    return {
      ...path,
      topic: getTopicById(path.topicId),
      items: getPathCourses(path),
    };
  },

  getProfile(userId: string): UserProfile {
    return profileStore.get(userId) ?? defaultProfile(userId);
  },

  updateProfile(userId: string, patch: Partial<UserProfile>) {
    const nextProfile = {
      ...this.getProfile(userId),
      ...patch,
      id: userId,
    };

    profileStore.set(userId, nextProfile);
    return nextProfile;
  },

  getPreferences(userId: string): UserPreferences {
    return preferenceStore.get(userId) ?? defaultPreferences(userId);
  },

  updatePreferences(userId: string, patch: Partial<UserPreferences>) {
    const nextPreferences = {
      ...this.getPreferences(userId),
      ...patch,
      userId,
    };

    preferenceStore.set(userId, nextPreferences);
    return nextPreferences;
  },

  getUserCourseStatuses(userId: string) {
    return getUserStatuses(userId).map((status) => ({
      ...status,
      course: findCourse(status.courseId),
    }));
  },

  upsertUserCourseStatus(userId: string, courseId: string, patch: Partial<UserCourseStatus>) {
    const existing = userCourseStatuses.find(
      (status) => status.userId === userId && status.courseId === courseId,
    );
    const now = formatISO(new Date());
    const normalizedStatus = (patch.status ?? existing?.status ?? "bookmarked") as UserCourseState;

    if (existing) {
      Object.assign(existing, patch, {
        status: normalizedStatus,
        percentComplete:
          patch.percentComplete ??
          existing.percentComplete ??
          (normalizedStatus === "completed" ? 100 : normalizedStatus === "not_started" ? 0 : 15),
        updatedAt: now,
      });

      if (normalizedStatus === "completed" && !existing.completedAt) {
        existing.completedAt = patch.completedAt ?? now;
      }

      return existing;
    }

    const nextRecord: UserCourseStatus = {
      id: `ucs-${slugify(`${userId}-${courseId}`)}`,
      userId,
      courseId,
      status: normalizedStatus,
      percentComplete:
        patch.percentComplete ?? (normalizedStatus === "completed" ? 100 : normalizedStatus === "bookmarked" ? 0 : 15),
      hoursSpent: patch.hoursSpent ?? 0,
      completionNotes: patch.completionNotes,
      completionEvidenceUrl: patch.completionEvidenceUrl,
      rating: patch.rating,
      completedAt: normalizedStatus === "completed" ? patch.completedAt ?? now : undefined,
      startedAt:
        normalizedStatus === "in_progress" || normalizedStatus === "completed" ? now : undefined,
      enrolledAt:
        normalizedStatus === "enrolled_external" ||
        normalizedStatus === "in_progress" ||
        normalizedStatus === "completed"
          ? now
          : undefined,
      updatedAt: now,
    };

    userCourseStatuses.push(nextRecord);
    return nextRecord;
  },

  getDashboard(userId: string): DashboardData {
    const profile = this.getProfile(userId);
    const preferences = this.getPreferences(userId);
    const statuses = getUserStatuses(userId);
    const currentCourses = getCatalogCourses();
    const currentProviders = getCatalogProviders();
    const recommendedNext = getTopRecommendations({
      courses: getVisibleCourses("free"),
      profile,
      preferences,
      statuses,
      topics,
    });
    const skillGaps = computeSkillGap({ skills, courses: currentCourses, statuses }).sort(
      (left, right) => right.gapScore - left.gapScore,
    );

    const topicBreakdown = topics
      .map((topic) => ({
        topicId: topic.id,
        topicName: topic.name,
        completed: statuses.filter(
          (status) =>
            status.status === "completed" && (findCourse(status.courseId)?.topicIds.includes(topic.id) ?? false),
        ).length,
        inProgress: statuses.filter(
          (status) =>
            status.status === "in_progress" && (findCourse(status.courseId)?.topicIds.includes(topic.id) ?? false),
        ).length,
      }))
      .filter((item) => item.completed > 0 || item.inProgress > 0);

    const providerBreakdown = currentProviders
      .map((provider) => ({
        providerId: provider.id,
        providerName: provider.name,
        total: statuses.filter((status) => findCourse(status.courseId)?.providerId === provider.id).length,
      }))
      .filter((item) => item.total > 0);

    const levelBreakdown = (["basic", "amateur", "professional"] as const).map((level) => ({
      level,
      total: statuses.filter((status) => findCourse(status.courseId)?.difficulty === level).length,
    }));

    const strongestTopic =
      topicBreakdown.sort((left, right) => right.completed - left.completed)[0]?.topicName ?? null;
    const weakestTopic =
      skillGaps.sort((left, right) => right.gapScore - left.gapScore)[0]?.skillName ?? null;

    return {
      summary: {
        saved: statuses.filter((status) => status.status === "bookmarked").length,
        started: statuses.filter((status) =>
          ["enrolled_external", "in_progress", "completed"].includes(status.status),
        ).length,
        completed: statuses.filter((status) => status.status === "completed").length,
        completionRate:
          statuses.length === 0
            ? 0
            : (statuses.filter((status) => status.status === "completed").length / statuses.length) * 100,
        hoursInvested: statuses.reduce((sum, status) => sum + status.hoursSpent, 0),
        strongestTopic,
        weakestTopic,
      },
      statusDistribution: ([
        "bookmarked",
        "enrolled_external",
        "in_progress",
        "completed",
        "not_started",
      ] as const)
        .map((name) => ({
          name,
          value: statuses.filter((status) => status.status === name).length,
        }))
        .filter((item) => item.value > 0),
      completionsOverTime: statuses
        .filter((status) => status.completedAt)
        .map((status) => ({
          date: status.completedAt!.slice(0, 10),
          completed: 1,
        })),
      topicBreakdown,
      providerBreakdown,
      levelBreakdown,
      skillGaps: skillGaps.slice(0, 5),
      recommendedNext,
    };
  },

  getRecommendations(userId: string) {
    return getTopRecommendations({
      courses: getVisibleCourses("free"),
      profile: this.getProfile(userId),
      preferences: this.getPreferences(userId),
      statuses: getUserStatuses(userId),
      topics,
      limit: 6,
    }).map((item) => ({
      ...item,
      course: findCourse(item.courseId),
    }));
  },

  getAdminSnapshot() {
    return {
      sources,
      sourceRuns,
      candidates: ingestionCandidates,
    };
  },

  listCandidates() {
    return ingestionCandidates;
  },

  runIngestion() {
    const now = formatISO(new Date());
    const source = sources[0];

    if (!source) {
      throw new Error("No sources configured");
    }

    const run = {
      id: `run-${sourceRuns.length + 1}`,
      sourceId: source.id,
      status: "queued",
      startedAt: now,
      discoveredCount: 1,
      insertedCount: 0,
      updatedCount: 0,
      rejectedCount: 0,
    } as const;

    sourceRuns.unshift(run);
    return run;
  },

  approveCandidate(id: string) {
    const candidate = ingestionCandidates.find((entry) => entry.id === id);

    if (!candidate) {
      return null;
    }

    candidate.parseStatus = "approved";
    return candidate;
  },

  rejectCandidate(id: string, reason: string) {
    const candidate = ingestionCandidates.find((entry) => entry.id === id);

    if (!candidate) {
      return null;
    }

    candidate.parseStatus = "rejected";
    candidate.rejectionReason = reason;
    return candidate;
  },
};
