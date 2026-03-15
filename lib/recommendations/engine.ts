import { differenceInDays } from "date-fns";
import type { Course, RecommendationItem, Topic, UserCourseStatus, UserPreferences, UserProfile } from "@/lib/types";

function levelFitScore(courseLevel: Course["difficulty"], targetLevel: UserProfile["currentLevel"] | UserPreferences["preferredLevel"]) {
  if (courseLevel === targetLevel) {
    return 100;
  }

  if (courseLevel === "unknown") {
    return 20;
  }

  const order = ["basic", "amateur", "professional"] as const;
  const distance = Math.abs(order.indexOf(courseLevel) - order.indexOf(targetLevel));
  return distance === 1 ? 65 : 35;
}

function freshnessScore(course: Course) {
  const days = differenceInDays(new Date(), new Date(course.freeVerifiedAt));
  return Math.max(20, 100 - days);
}

export function scoreCourseRecommendation(params: {
  course: Course;
  profile: UserProfile;
  preferences: UserPreferences;
  statuses: UserCourseStatus[];
  topics: Topic[];
}) {
  const { course, profile, preferences, statuses, topics } = params;
  const completedIds = new Set(
    statuses.filter((status) => status.status === "completed").map((status) => status.courseId),
  );

  if (completedIds.has(course.id) || !course.isActive || !course.isFree) {
    return null;
  }

  const preferredTopicSet = new Set(preferences.preferredTopics);
  const preferredProviderSet = new Set(preferences.preferredProviders);
  const topicMatches = course.topicIds.filter((topicId) => preferredTopicSet.has(topicId)).length;
  const missingFoundations = topics.some(
    (topic) =>
      preferredTopicSet.has(topic.id) &&
      topic.slug !== "llm" &&
      !statuses.some((status) => status.courseId === "course-llm-foundations" && status.status === "completed"),
  );

  const weightedScore =
    (Math.min(100, topicMatches * 45) * 0.35) +
    (levelFitScore(course.difficulty, preferences.preferredLevel ?? profile.currentLevel) * 0.2) +
    ((missingFoundations && course.topicIds.includes("topic-llm") ? 100 : 55) * 0.2) +
    ((preferredProviderSet.has(course.providerId) ? 100 : 50) * 0.1) +
    (((course.durationHours == null ? 60 : course.durationHours <= 6 ? 90 : course.durationHours <= 10 ? 65 : 40)) * 0.05) +
    (((preferences.wantsCertificates ? Number(course.hasCertificate) : 1) * 100) * 0.05) +
    (freshnessScore(course) * 0.05);

  const reasons = [];
  if (topicMatches > 0) {
    reasons.push("matches preferred topics");
  }
  if (preferredProviderSet.has(course.providerId)) {
    reasons.push("preferred provider");
  }
  if (course.durationHours != null && course.durationHours <= profile.weeklyStudyHours) {
    reasons.push("fits weekly study time");
  }
  if (course.freeVerificationStatus === "verified") {
    reasons.push("recently free-verified");
  }

  return {
    courseId: course.id,
    score: Number(weightedScore.toFixed(2)),
    reason: reasons.join(", ") || "fills a foundational gap",
  } satisfies RecommendationItem;
}

export function getTopRecommendations(params: {
  courses: Course[];
  profile: UserProfile;
  preferences: UserPreferences;
  statuses: UserCourseStatus[];
  topics: Topic[];
  limit?: number;
}) {
  const recommendations = params.courses
    .map((course) =>
      scoreCourseRecommendation({
        course,
        profile: params.profile,
        preferences: params.preferences,
        statuses: params.statuses,
        topics: params.topics,
      }),
    )
    .filter((item): item is RecommendationItem => Boolean(item))
    .sort((left, right) => right.score - left.score);

  return recommendations.slice(0, params.limit ?? 5);
}
