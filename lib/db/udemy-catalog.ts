import udemyGenaiCoursesJson from "@/data/udemy-genai-courses.json";
import { slugify } from "@/lib/utils";
import type { Course, CourseLevel, Provider } from "@/lib/types";

type UdemyCourseEntry = {
  courseId: number;
  title: string;
  canonicalUrl: string;
  headline: string;
  instructors: string[];
  topicPages: string[];
  languageCode: string;
  level: string | null;
  durationHours: number | null;
  rating: number | null;
  reviewCount: number;
  subscriberCount: number;
  isPaid: boolean;
  isInPersonalPlanCollection: boolean;
  subscriptionAvailabilityStatus: boolean;
  publishedAt: string | null;
  lastUpdateDate: string | null;
  imageUrl: string | null;
};

type UdemyCatalogData = {
  providers: Provider[];
  courses: Course[];
};

const verifiedAt = "2026-03-17T04:45:00.000Z";

const udemyProvider: Provider = {
  id: "provider-udemy",
  name: "Udemy",
  websiteUrl: "https://www.udemy.com",
  providerType: "mooc",
  isActive: true,
};

const topicLabels: Record<string, string> = {
  "topic-llm": "LLM systems",
  "topic-genai": "generative AI",
  "topic-ml": "machine learning",
  "topic-prompt": "prompt engineering",
  "topic-rag": "RAG",
  "topic-vector": "vector search",
  "topic-agents": "AI agents",
  "topic-eval": "evaluation",
  "topic-copilot": "AI productivity",
  "topic-data": "data science",
  "topic-cv": "computer vision",
  "topic-multimodal": "multimodal generation",
  "topic-rl": "reinforcement learning",
};

function addTopic(topicIds: string[], topicId: string) {
  if (!topicIds.includes(topicId)) {
    topicIds.push(topicId);
  }
}

function inferTopicIds(entry: UdemyCourseEntry) {
  const normalized = `${entry.title} ${entry.headline} ${entry.topicPages.join(" ")}`.toLowerCase();
  const topicIds: string[] = [];

  if (
    normalized.includes("generative ai") ||
    normalized.includes("gen ai") ||
    normalized.includes("genai") ||
    normalized.includes("chatgpt") ||
    normalized.includes("claude") ||
    normalized.includes("gemini")
  ) {
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("llm") ||
    normalized.includes("langchain") ||
    normalized.includes("huggingface") ||
    normalized.includes("transformer") ||
    normalized.includes("openai") ||
    normalized.includes("ollama")
  ) {
    addTopic(topicIds, "topic-llm");
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("prompt") ||
    normalized.includes("chatgpt") ||
    normalized.includes("claude") ||
    normalized.includes("gemini")
  ) {
    addTopic(topicIds, "topic-prompt");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("rag") || normalized.includes("retrieval")) {
    addTopic(topicIds, "topic-rag");
    addTopic(topicIds, "topic-vector");
    addTopic(topicIds, "topic-llm");
  }

  if (normalized.includes("vector")) {
    addTopic(topicIds, "topic-vector");
  }

  if (normalized.includes("agent") || normalized.includes("agentic") || normalized.includes("autogen") || normalized.includes("mcp")) {
    addTopic(topicIds, "topic-agents");
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("cursor") ||
    normalized.includes("claude code") ||
    normalized.includes("copilot") ||
    normalized.includes("productivity") ||
    normalized.includes("work productivity")
  ) {
    addTopic(topicIds, "topic-copilot");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("deepeval") || normalized.includes("ragas") || normalized.includes("test llm")) {
    addTopic(topicIds, "topic-eval");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("data science") || normalized.includes("stats") || normalized.includes("sql")) {
    addTopic(topicIds, "topic-data");
    addTopic(topicIds, "topic-ml");
  }

  if (normalized.includes("machine learning") || normalized.includes("deep learning") || normalized.includes("ai engineer")) {
    addTopic(topicIds, "topic-ml");
  }

  if (
    normalized.includes("comfyui") ||
    normalized.includes("video creation") ||
    normalized.includes("midjourney") ||
    normalized.includes("image")
  ) {
    addTopic(topicIds, "topic-multimodal");
    addTopic(topicIds, "topic-cv");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("reinforcement learning") || normalized.includes(" and rl")) {
    addTopic(topicIds, "topic-rl");
  }

  if (topicIds.length === 0) {
    addTopic(topicIds, "topic-genai");
  }

  if (topicIds.includes("topic-llm") && !topicIds.includes("topic-genai")) {
    addTopic(topicIds, "topic-genai");
  }

  return topicIds.slice(0, 5);
}

function inferDifficulty(
  entry: UdemyCourseEntry,
  topicIds: string[],
): Exclude<CourseLevel, "unknown"> {
  const level = (entry.level ?? "").toLowerCase();
  const normalized = `${entry.title} ${entry.headline}`.toLowerCase();

  if (
    level.includes("beginner") ||
    normalized.includes("absolute beginners") ||
    normalized.includes("for beginners")
  ) {
    return "basic";
  }

  if (
    normalized.includes("architect") ||
    normalized.includes("deployment") ||
    normalized.includes("full-stack") ||
    normalized.includes("masterclass") ||
    normalized.includes("certification") ||
    normalized.includes("bootcamp") ||
    normalized.includes("engineer")
  ) {
    return "professional";
  }

  if (
    topicIds.includes("topic-agents") ||
    topicIds.includes("topic-rag") ||
    topicIds.includes("topic-eval") ||
    topicIds.includes("topic-llm")
  ) {
    return "amateur";
  }

  return level.includes("all levels") ? "amateur" : "basic";
}

function inferSkillIds(topicIds: string[]) {
  const skillIds = new Set<string>();

  if (topicIds.includes("topic-rag") || topicIds.includes("topic-vector")) {
    skillIds.add("skill-rag-architecture");
  }

  if (topicIds.some((topicId) => topicId === "topic-llm" || topicId === "topic-genai" || topicId === "topic-prompt")) {
    skillIds.add("skill-model-selection");
    skillIds.add("skill-prompt-evals");
  }

  if (topicIds.includes("topic-agents")) {
    skillIds.add("skill-agent-tooling");
  }

  if (topicIds.includes("topic-eval")) {
    skillIds.add("skill-safety-review");
  }

  if (topicIds.includes("topic-data") || topicIds.includes("topic-ml")) {
    skillIds.add("skill-data-analysis");
    skillIds.add("skill-feature-engineering");
  }

  if (topicIds.includes("topic-copilot")) {
    skillIds.add("skill-copilot-design");
  }

  if (topicIds.includes("topic-cv")) {
    skillIds.add("skill-vision-systems");
  }

  if (topicIds.includes("topic-multimodal")) {
    skillIds.add("skill-multimodal-systems");
  }

  if (topicIds.includes("topic-rl")) {
    skillIds.add("skill-rl-experimentation");
  }

  if (skillIds.size === 0) {
    skillIds.add("skill-model-selection");
  }

  return [...skillIds].slice(0, 3);
}

function buildSummary(entry: UdemyCourseEntry) {
  const summary = entry.headline.trim();

  if (!summary) {
    return "Curated paid Udemy GenAI course sourced from official topic pages.";
  }

  return summary.endsWith(".") ? summary : `${summary}.`;
}

function buildPrerequisiteText(level: Exclude<CourseLevel, "unknown">) {
  if (level === "professional") {
    return "Best if you already have coding or AI fundamentals and want deeper project work.";
  }

  if (level === "amateur") {
    return "Helpful if you already know the basics of prompting, Python, or modern AI workflows.";
  }

  return "Designed as a starting point for learners exploring GenAI workflows.";
}

function buildSyllabus(topicIds: string[]) {
  return topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .join(", ");
}

function normalizeLanguageCode(languageCode: string) {
  return languageCode.split("_")[0]?.toLowerCase() || "en";
}

function normalizePublishedAt(entry: UdemyCourseEntry) {
  if (entry.publishedAt) {
    return entry.publishedAt;
  }

  if (entry.lastUpdateDate) {
    return `${entry.lastUpdateDate}T00:00:00.000Z`;
  }

  return verifiedAt;
}

export function getUdemyCatalogData(): UdemyCatalogData {
  const entries = (udemyGenaiCoursesJson as UdemyCourseEntry[]).filter((entry) => entry.isPaid);
  const courses = entries.map((entry) => {
    const topicIds = inferTopicIds(entry);
    const difficulty = inferDifficulty(entry, topicIds);

    return {
      id: `udemy-${entry.courseId}-${slugify(entry.title)}`,
      title: entry.title,
      summary: buildSummary(entry),
      canonicalUrl: entry.canonicalUrl,
      enrollmentUrl: entry.canonicalUrl,
      providerId: udemyProvider.id,
      topicIds,
      skillIds: inferSkillIds(topicIds),
      difficulty,
      durationHours: entry.durationHours,
      languageCode: normalizeLanguageCode(entry.languageCode),
      isFree: false,
      freeVerificationStatus: "verified",
      freeVerifiedAt: verifiedAt,
      isActive: true,
      courseMode: "self-paced",
      hasCertificate: true,
      certificateIsFree: false,
      instructorName: entry.instructors.join(", "),
      prerequisiteText: buildPrerequisiteText(difficulty),
      syllabus: buildSyllabus(topicIds),
      imageUrl: entry.imageUrl ?? undefined,
      publishedAt: normalizePublishedAt(entry),
    } satisfies Course;
  });

  return {
    providers: [udemyProvider],
    courses,
  };
}
