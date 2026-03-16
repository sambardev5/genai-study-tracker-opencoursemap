import mavenAiCoursesJson from "@/data/maven-ai-courses.json";
import { slugify } from "@/lib/utils";
import type { Course, CourseLevel, Provider } from "@/lib/types";

type MavenTag = {
  type: string;
  slug: string;
  label: string;
};

type MavenCourseEntry = {
  id: number;
  title: string;
  schoolSlug: string;
  courseSlug: string;
  canonicalUrl: string;
  instructors: string[];
  nextLiveCohort: string | null;
  ratingCount: number;
  sourceUrls: string[];
  tags: MavenTag[];
};

type MavenCatalogData = {
  providers: Provider[];
  courses: Course[];
};

const verifiedAt = "2026-03-16T20:20:00.000Z";

const mavenProvider: Provider = {
  id: "provider-maven",
  name: "Maven",
  websiteUrl: "https://maven.com",
  providerType: "mooc",
  isActive: true,
};

const sourceLabels: Record<string, string> = {
  "https://maven.com/courses/for-product-managers/ai": "AI for Product Managers",
  "https://maven.com/courses/for-engineers/agentic-ai": "Agentic AI for Engineers",
  "https://maven.com/courses/for-product-managers/agentic-ai": "Agentic AI for Product Managers",
  "https://maven.com/courses/for-product-managers/prototyping": "AI Prototyping for Product Managers",
  "https://maven.com/courses/for-product-managers/evals": "AI Evals for Product Managers",
  "https://maven.com/courses/for-engineers/ml": "Machine Learning for Engineers",
  "https://maven.com/courses/for-engineers/ai-coding": "AI Coding for Engineers",
  "https://maven.com/courses/for-designers/ai": "AI for Designers",
  "https://maven.com/courses/for-designers/prototyping": "AI Prototyping for Designers",
};

const topicLabels: Record<string, string> = {
  "topic-llm": "LLM systems",
  "topic-genai": "generative AI",
  "topic-ml": "machine learning",
  "topic-rag": "RAG",
  "topic-agents": "agentic AI",
  "topic-eval": "AI evaluation",
  "topic-mlops": "AI engineering",
  "topic-rai": "responsible AI",
  "topic-data": "data and analytics",
  "topic-copilot": "AI-assisted building",
};

const tagTopicMap: Record<string, string[]> = {
  ai: ["topic-genai"],
  "agentic-ai": ["topic-agents", "topic-genai"],
  "ai-coding": ["topic-copilot", "topic-genai"],
  prototyping: ["topic-copilot", "topic-genai"],
  evals: ["topic-eval", "topic-genai"],
  rag: ["topic-rag", "topic-llm"],
  llms: ["topic-llm", "topic-genai"],
  ml: ["topic-ml", "topic-data"],
  "model-development": ["topic-ml", "topic-genai"],
  experimentation: ["topic-data", "topic-eval"],
  "data-analysis": ["topic-data", "topic-ml"],
  management: ["topic-rai"],
  leadership: ["topic-rai"],
  strategy: ["topic-rai"],
};

function addTopic(topicIds: string[], topicId: string) {
  if (!topicIds.includes(topicId)) {
    topicIds.push(topicId);
  }
}

function inferTopicIds(entry: MavenCourseEntry) {
  const normalized = `${entry.title} ${entry.tags.map((tag) => `${tag.slug} ${tag.label}`).join(" ")}`.toLowerCase();
  const topicIds: string[] = [];

  for (const tag of entry.tags) {
    for (const topicId of tagTopicMap[tag.slug] ?? []) {
      addTopic(topicIds, topicId);
    }
  }

  if (normalized.includes("agent")) {
    addTopic(topicIds, "topic-agents");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("rag")) {
    addTopic(topicIds, "topic-rag");
    addTopic(topicIds, "topic-llm");
  }

  if (normalized.includes("llm") || normalized.includes("claude code")) {
    addTopic(topicIds, "topic-llm");
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("machine learning") ||
    normalized.includes(" ml ") ||
    normalized.includes("recommender")
  ) {
    addTopic(topicIds, "topic-ml");
    addTopic(topicIds, "topic-data");
  }

  if (normalized.includes("eval")) {
    addTopic(topicIds, "topic-eval");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("responsible ai") || normalized.includes("governance")) {
    addTopic(topicIds, "topic-rai");
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("prototype") ||
    normalized.includes("prototyping") ||
    normalized.includes("vibe coding") ||
    normalized.includes("claude code") ||
    normalized.includes("coding")
  ) {
    addTopic(topicIds, "topic-copilot");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("analytics") || normalized.includes("research")) {
    addTopic(topicIds, "topic-data");
  }

  if (normalized.includes("engineering")) {
    addTopic(topicIds, "topic-mlops");
  }

  if (topicIds.length === 0) {
    addTopic(topicIds, "topic-genai");
  }

  return topicIds.slice(0, 4);
}

function inferDifficulty(entry: MavenCourseEntry, topicIds: string[]): Exclude<CourseLevel, "unknown"> {
  const normalized = `${entry.title} ${entry.tags.map((tag) => tag.slug).join(" ")}`.toLowerCase();

  if (
    normalized.includes("advanced") ||
    normalized.includes("leadership") ||
    normalized.includes("enterprise") ||
    normalized.includes("executive") ||
    normalized.includes("mastery") ||
    normalized.includes("professional") ||
    normalized.includes("certification") ||
    normalized.includes("certificate") ||
    normalized.includes("residency") ||
    normalized.includes("end-to-end")
  ) {
    return "professional";
  }

  if (
    normalized.includes("101") ||
    normalized.includes("basics") ||
    normalized.includes("discovery") ||
    normalized.includes("intro") ||
    normalized.includes("introduction")
  ) {
    return "basic";
  }

  if (topicIds.includes("topic-agents") || topicIds.includes("topic-rag")) {
    return "amateur";
  }

  return "amateur";
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

  if (topicIds.includes("topic-eval") || topicIds.includes("topic-rai")) {
    skillIds.add("skill-safety-review");
  }

  if (topicIds.includes("topic-ml") || topicIds.includes("topic-data")) {
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

function buildSummary(entry: MavenCourseEntry, topicIds: string[]) {
  const topicSummary = topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .slice(0, 2)
    .join(" and ");
  const sourceSummary = entry.sourceUrls
    .map((sourceUrl) => sourceLabels[sourceUrl] ?? "Maven AI collections")
    .slice(0, 2)
    .join(", ");

  return `Paid live cohort from Maven covering ${topicSummary || "AI workflows"}, sourced from ${sourceSummary}.`;
}

function buildPrerequisiteText(level: Exclude<CourseLevel, "unknown">) {
  if (level === "professional") {
    return "Best for practitioners with prior product, design, or engineering experience.";
  }

  if (level === "basic") {
    return "Suitable if you want a structured starting point and guided practice.";
  }

  return "Helpful if you already know the basics and want a live cohort to apply them.";
}

function buildSyllabus(entry: MavenCourseEntry, topicIds: string[]) {
  const labels = [
    ...topicIds.map((topicId) => topicLabels[topicId]).filter(Boolean),
    ...entry.tags
      .filter((tag) => tag.type === "topic")
      .map((tag) => tag.label),
  ];

  return [...new Set(labels)].slice(0, 6).join(", ");
}

function hasCertificate(entry: MavenCourseEntry) {
  const normalized = `${entry.title} ${entry.tags.map((tag) => tag.slug).join(" ")}`.toLowerCase();
  return normalized.includes("certificate") || normalized.includes("certification");
}

function createMavenCatalogData(): MavenCatalogData {
  const entries = mavenAiCoursesJson as MavenCourseEntry[];

  return {
    providers: [mavenProvider],
    courses: entries.map((entry) => {
      const topicIds = inferTopicIds(entry);
      const difficulty = inferDifficulty(entry, topicIds);
      const startsAt = entry.nextLiveCohort ?? verifiedAt;

      return {
        id: `course-maven-${slugify(`${entry.id}-${entry.schoolSlug}-${entry.courseSlug}`)}`,
        title: entry.title.trim(),
        summary: buildSummary(entry, topicIds),
        canonicalUrl: entry.canonicalUrl,
        enrollmentUrl: entry.canonicalUrl,
        providerId: mavenProvider.id,
        topicIds,
        skillIds: inferSkillIds(topicIds),
        difficulty,
        durationHours: null,
        languageCode: "en",
        isFree: false,
        freeVerificationStatus: "unknown",
        freeVerifiedAt: verifiedAt,
        isActive: true,
        courseMode: "cohort",
        hasCertificate: hasCertificate(entry),
        certificateIsFree: false,
        instructorName: entry.instructors.slice(0, 2).join(", ") || "Maven instructor",
        prerequisiteText: buildPrerequisiteText(difficulty),
        syllabus: buildSyllabus(entry, topicIds),
        publishedAt: startsAt,
      } satisfies Course;
    }),
  };
}

const mavenCatalogData = createMavenCatalogData();

export function getMavenCatalogData() {
  return mavenCatalogData;
}
