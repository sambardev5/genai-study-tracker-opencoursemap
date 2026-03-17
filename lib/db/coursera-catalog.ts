import courseraGenaiCoursesJson from "@/data/coursera-genai-courses.json";
import { slugify } from "@/lib/utils";
import type { Course, CourseLevel, Provider } from "@/lib/types";

type CourseraProgramType = "course" | "specialization" | "professional-certificate" | "guided-project";

type CourseraCourseEntry = {
  canonicalUrl: string;
  title: string;
  programType: CourseraProgramType;
};

type CourseraCatalogData = {
  providers: Provider[];
  courses: Course[];
};

const verifiedAt = "2026-03-16T22:15:00.000Z";

const courseraProvider: Provider = {
  id: "provider-coursera",
  name: "Coursera",
  websiteUrl: "https://www.coursera.org",
  providerType: "mooc",
  isActive: true,
};

const topicLabels: Record<string, string> = {
  "topic-llm": "LLM systems",
  "topic-genai": "generative AI",
  "topic-ml": "machine learning",
  "topic-rag": "RAG",
  "topic-agents": "AI agents",
  "topic-eval": "evaluation",
  "topic-mlops": "MLOps",
  "topic-rai": "responsible AI",
  "topic-data": "data science",
  "topic-copilot": "copilot workflows",
};

function addTopic(topicIds: string[], topicId: string) {
  if (!topicIds.includes(topicId)) {
    topicIds.push(topicId);
  }
}

function inferTopicIds(entry: CourseraCourseEntry) {
  const normalized = `${entry.title} ${entry.canonicalUrl}`.toLowerCase();
  const topicIds: string[] = [];

  addTopic(topicIds, "topic-genai");

  if (
    normalized.includes("llm") ||
    normalized.includes("model selection") ||
    normalized.includes("developer") ||
    normalized.includes("software") ||
    normalized.includes("application") ||
    normalized.includes("front end") ||
    normalized.includes("back end") ||
    normalized.includes("it support")
  ) {
    addTopic(topicIds, "topic-llm");
  }

  if (normalized.includes("agent")) {
    addTopic(topicIds, "topic-agents");
    addTopic(topicIds, "topic-llm");
  }

  if (
    normalized.includes("analytics") ||
    normalized.includes("data") ||
    normalized.includes("forecast") ||
    normalized.includes("market research") ||
    normalized.includes("trading") ||
    normalized.includes("credit scoring") ||
    normalized.includes("insurance") ||
    normalized.includes("healthcare") ||
    normalized.includes("diagnostic") ||
    normalized.includes("financial")
  ) {
    addTopic(topicIds, "topic-data");
    addTopic(topicIds, "topic-ml");
  }

  if (
    normalized.includes("marketing") ||
    normalized.includes("customer") ||
    normalized.includes("sales") ||
    normalized.includes("social media") ||
    normalized.includes("presentations") ||
    normalized.includes("productivity") ||
    normalized.includes("executive") ||
    normalized.includes("business leader") ||
    normalized.includes("manager") ||
    normalized.includes("human resources") ||
    normalized.includes("payroll") ||
    normalized.includes("consultant") ||
    normalized.includes("ux") ||
    normalized.includes("writing")
  ) {
    addTopic(topicIds, "topic-copilot");
  }

  if (
    normalized.includes("governance") ||
    normalized.includes("compliance") ||
    normalized.includes("legal") ||
    normalized.includes("cybersecurity") ||
    normalized.includes("risk") ||
    normalized.includes("ceo") ||
    normalized.includes("contract")
  ) {
    addTopic(topicIds, "topic-rai");
    addTopic(topicIds, "topic-eval");
  }

  if (
    normalized.includes("deployment") ||
    normalized.includes("devops") ||
    normalized.includes("ops") ||
    normalized.includes("running") ||
    normalized.includes("software") ||
    normalized.includes("technology consultant")
  ) {
    addTopic(topicIds, "topic-mlops");
  }

  if (normalized.includes("model selection") || normalized.includes("diagnostic")) {
    addTopic(topicIds, "topic-eval");
  }

  if (normalized.includes("rag")) {
    addTopic(topicIds, "topic-rag");
    addTopic(topicIds, "topic-llm");
  }

  return topicIds.slice(0, 5);
}

function inferDifficulty(
  entry: CourseraCourseEntry,
  topicIds: string[],
): Exclude<CourseLevel, "unknown"> {
  const normalized = `${entry.title} ${entry.programType}`.toLowerCase();

  if (
    entry.programType === "guided-project" ||
    normalized.includes("basics") ||
    normalized.includes("introduction") ||
    normalized.includes("for everyone") ||
    normalized.includes("foundations")
  ) {
    return "basic";
  }

  if (
    entry.programType === "professional-certificate" ||
    normalized.includes("governance") ||
    normalized.includes("compliance") ||
    normalized.includes("legal") ||
    normalized.includes("cybersecurity") ||
    normalized.includes("devops") ||
    normalized.includes("ops") ||
    normalized.includes("deployment") ||
    normalized.includes("strategy") ||
    normalized.includes("risk") ||
    topicIds.includes("topic-mlops") ||
    topicIds.includes("topic-rai")
  ) {
    return "professional";
  }

  if (
    entry.programType === "specialization" ||
    normalized.includes("advanced") ||
    normalized.includes("developer") ||
    normalized.includes("scientist") ||
    normalized.includes("analyst") ||
    normalized.includes("manager") ||
    normalized.includes("model selection") ||
    topicIds.includes("topic-agents") ||
    topicIds.includes("topic-llm")
  ) {
    return "amateur";
  }

  return "basic";
}

function inferSkillIds(topicIds: string[]) {
  const skillIds = new Set<string>();

  if (topicIds.includes("topic-rag")) {
    skillIds.add("skill-rag-architecture");
  }

  if (topicIds.some((topicId) => topicId === "topic-llm" || topicId === "topic-genai")) {
    skillIds.add("skill-model-selection");
    skillIds.add("skill-prompt-evals");
  }

  if (topicIds.includes("topic-agents")) {
    skillIds.add("skill-agent-tooling");
  }

  if (topicIds.includes("topic-rai") || topicIds.includes("topic-eval")) {
    skillIds.add("skill-safety-review");
  }

  if (topicIds.includes("topic-data") || topicIds.includes("topic-ml")) {
    skillIds.add("skill-data-analysis");
    skillIds.add("skill-feature-engineering");
  }

  if (topicIds.includes("topic-mlops")) {
    skillIds.add("skill-mlops-operations");
  }

  if (topicIds.includes("topic-copilot")) {
    skillIds.add("skill-copilot-design");
  }

  if (skillIds.size === 0) {
    skillIds.add("skill-model-selection");
  }

  return [...skillIds].slice(0, 3);
}

function buildSummary(entry: CourseraCourseEntry, topicIds: string[]) {
  const programTypeLabel =
    entry.programType === "guided-project"
      ? "guided project"
      : entry.programType === "professional-certificate"
        ? "professional certificate"
        : entry.programType;
  const topicSummary = topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .slice(0, 2)
    .join(" and ");

  return `Coursera ${programTypeLabel} focused on ${topicSummary || "generative AI workflows"}. Listed with the direct provider URL and paid certificate options.`;
}

function buildPrerequisiteText(level: Exclude<CourseLevel, "unknown">) {
  if (level === "professional") {
    return "Best if you already have role-specific context and want applied GenAI execution guidance.";
  }

  if (level === "amateur") {
    return "Helpful if you already understand basic AI workflows and want a more applied use case.";
  }

  return "Designed as an accessible starting point for learners exploring GenAI in practice.";
}

function buildSyllabus(topicIds: string[]) {
  return topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .join(", ");
}

function inferDurationHours(entry: CourseraCourseEntry) {
  if (entry.programType === "guided-project") {
    return 2;
  }

  return null;
}

export function getCourseraCatalogData(): CourseraCatalogData {
  const entries = courseraGenaiCoursesJson as CourseraCourseEntry[];
  const courses = entries.map((entry) => {
    const topicIds = inferTopicIds(entry);
    const difficulty = inferDifficulty(entry, topicIds);

    return {
      id: `coursera-${slugify(`${entry.programType}-${entry.title}`)}`,
      title: entry.title,
      summary: buildSummary(entry, topicIds),
      canonicalUrl: entry.canonicalUrl,
      enrollmentUrl: entry.canonicalUrl,
      providerId: courseraProvider.id,
      topicIds,
      skillIds: inferSkillIds(topicIds),
      difficulty,
      durationHours: inferDurationHours(entry),
      languageCode: "en",
      isFree: true,
      freeVerificationStatus: "verified",
      freeVerifiedAt: verifiedAt,
      isActive: true,
      courseMode: "self-paced",
      hasCertificate: true,
      certificateIsFree: false,
      instructorName: "Coursera",
      prerequisiteText: buildPrerequisiteText(difficulty),
      syllabus: buildSyllabus(topicIds),
      publishedAt: verifiedAt,
    } satisfies Course;
  });

  return {
    providers: [courseraProvider],
    courses,
  };
}
