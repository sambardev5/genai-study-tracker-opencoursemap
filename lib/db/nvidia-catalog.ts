import nvidiaAiCoursesJson from "@/data/nvidia-ai-courses.json";
import { slugify } from "@/lib/utils";
import type { Course, CourseLevel, Provider } from "@/lib/types";

type NvidiaPricingCategory = "free" | "paid" | "other";

type NvidiaCourseEntry = {
  courseId: string;
  title: string;
  canonicalUrl: string;
  summary: string;
  level: string | null;
  subject: string | null;
  topics: string[];
  tags: string[];
  pricingCategory: NvidiaPricingCategory;
  courseMode: "self-paced" | "live";
  durationHours: number | null;
  hasCertificate: boolean;
  languageCode: string;
  publishedAt: string;
};

type NvidiaCatalogData = {
  providers: Provider[];
  courses: Course[];
};

const verifiedAt = "2026-03-16T21:10:00.000Z";

const nvidiaProvider: Provider = {
  id: "provider-nvidia-dli",
  name: "NVIDIA DLI",
  websiteUrl: "https://www.nvidia.com/en-us/training/find-training/?query=AI",
  providerType: "community",
  isActive: true,
};

const topicLabels: Record<string, string> = {
  "topic-llm": "LLM systems",
  "topic-genai": "generative AI",
  "topic-ml": "machine learning",
  "topic-rag": "RAG",
  "topic-agents": "AI agents",
  "topic-mlops": "AI deployment",
  "topic-data": "data science",
  "topic-cv": "computer vision",
  "topic-multimodal": "multimodal systems",
  "topic-rl": "reinforcement learning",
  "topic-gpu": "GPU computing",
  "topic-robotics": "robotics",
  "topic-simulation": "simulation and physical AI",
};

function addTopic(topicIds: string[], topicId: string) {
  if (!topicIds.includes(topicId)) {
    topicIds.push(topicId);
  }
}

function inferTopicIds(entry: NvidiaCourseEntry) {
  const normalized = `${entry.title} ${entry.summary} ${entry.subject ?? ""} ${entry.topics.join(" ")} ${entry.tags.join(" ")}`.toLowerCase();
  const topicIds: string[] = [];

  if (
    normalized.includes("generative ai") ||
    normalized.includes("genai") ||
    normalized.includes("llm") ||
    normalized.includes("transformer") ||
    normalized.includes("natural language processing") ||
    normalized.includes("nemotron") ||
    normalized.includes("nemo") ||
    normalized.includes("langchain") ||
    normalized.includes("llamaindex")
  ) {
    addTopic(topicIds, "topic-genai");
    addTopic(topicIds, "topic-llm");
  }

  if (
    normalized.includes("rag") ||
    normalized.includes("retrieval-augmented generation") ||
    normalized.includes("retrieval augmented generation") ||
    normalized.includes("semantic search") ||
    normalized.includes("document reasoning")
  ) {
    addTopic(topicIds, "topic-rag");
    addTopic(topicIds, "topic-llm");
  }

  if (normalized.includes("agent") || normalized.includes("agentic") || normalized.includes("dialog management")) {
    addTopic(topicIds, "topic-agents");
    addTopic(topicIds, "topic-genai");
  }

  if (
    normalized.includes("deep learning") ||
    normalized.includes("machine learning") ||
    normalized.includes("pytorch") ||
    normalized.includes("tao toolkit")
  ) {
    addTopic(topicIds, "topic-ml");
  }

  if (
    normalized.includes("data science") ||
    normalized.includes("rapids") ||
    normalized.includes("cugraph") ||
    normalized.includes("nvtabular") ||
    normalized.includes("merlin")
  ) {
    addTopic(topicIds, "topic-data");
    addTopic(topicIds, "topic-ml");
  }

  if (
    normalized.includes("robotics") ||
    normalized.includes("robot ") ||
    normalized.includes("robotics") ||
    normalized.includes("isaac") ||
    normalized.includes("jetson")
  ) {
    addTopic(topicIds, "topic-robotics");
    addTopic(topicIds, "topic-cv");
  }

  if (
    normalized.includes("computer vision") ||
    normalized.includes("vision") ||
    normalized.includes("video analytics") ||
    normalized.includes("perception") ||
    normalized.includes("synthetic data")
  ) {
    addTopic(topicIds, "topic-cv");
    addTopic(topicIds, "topic-multimodal");
  }

  if (normalized.includes("multimodal")) {
    addTopic(topicIds, "topic-multimodal");
    addTopic(topicIds, "topic-genai");
  }

  if (normalized.includes("reinforcement learning") || normalized.includes("isaac lab")) {
    addTopic(topicIds, "topic-rl");
    addTopic(topicIds, "topic-robotics");
  }

  if (
    normalized.includes("openusd") ||
    normalized.includes("omniverse") ||
    normalized.includes("simulation") ||
    normalized.includes("physical ai") ||
    normalized.includes("rendering") ||
    normalized.includes("ray tracing")
  ) {
    addTopic(topicIds, "topic-simulation");
    addTopic(topicIds, "topic-multimodal");
  }

  if (
    normalized.includes("accelerated computing") ||
    normalized.includes("cuda") ||
    normalized.includes("openacc") ||
    normalized.includes("nsight") ||
    normalized.includes("performance optimization")
  ) {
    addTopic(topicIds, "topic-gpu");
    addTopic(topicIds, "topic-mlops");
  }

  if (
    normalized.includes("triton") ||
    normalized.includes("deployment") ||
    normalized.includes("inferencing microservice") ||
    normalized.includes("nim")
  ) {
    addTopic(topicIds, "topic-mlops");
  }

  if (topicIds.length === 0) {
    if ((entry.subject ?? "").toLowerCase().includes("data")) {
      addTopic(topicIds, "topic-data");
      addTopic(topicIds, "topic-ml");
    } else {
      addTopic(topicIds, "topic-genai");
    }
  }

  return topicIds.slice(0, 5);
}

function inferDifficulty(entry: NvidiaCourseEntry): Exclude<CourseLevel, "unknown"> {
  switch (entry.level) {
    case "Technical - Advanced":
      return "professional";
    case "Technical - Intermediate":
      return "amateur";
    case "Introductory":
    case "Technical - Beginner":
    case "General Interest":
    default:
      return "basic";
  }
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

  if (topicIds.some((topicId) => topicId === "topic-ml" || topicId === "topic-data")) {
    skillIds.add("skill-feature-engineering");
    skillIds.add("skill-data-analysis");
  }

  if (topicIds.some((topicId) => topicId === "topic-mlops" || topicId === "topic-gpu")) {
    skillIds.add("skill-mlops-operations");
  }

  if (topicIds.some((topicId) => topicId === "topic-cv" || topicId === "topic-robotics")) {
    skillIds.add("skill-vision-systems");
  }

  if (topicIds.some((topicId) => topicId === "topic-multimodal" || topicId === "topic-simulation")) {
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

function buildSummary(entry: NvidiaCourseEntry) {
  if (entry.summary.endsWith(".")) {
    return entry.summary;
  }

  return `${entry.summary}.`;
}

function buildPrerequisiteText(entry: NvidiaCourseEntry, difficulty: Exclude<CourseLevel, "unknown">) {
  if (entry.courseMode === "live") {
    return difficulty === "professional"
      ? "Best for practitioners who already have hands-on AI or ML experience."
      : "Helpful if you want guided instruction and hands-on lab time with an NVIDIA instructor.";
  }

  return difficulty === "professional"
    ? "Best once you already know the fundamentals and want to go deeper on deployment or specialization."
    : "Accessible self-paced material for building hands-on familiarity with the topic.";
}

function buildSyllabus(entry: NvidiaCourseEntry, topicIds: string[]) {
  const labels = [
    ...(entry.subject ? [entry.subject] : []),
    ...entry.topics,
    ...topicIds.map((topicId) => topicLabels[topicId]).filter(Boolean),
  ];

  return [...new Set(labels)].slice(0, 6).join(", ");
}

function createNvidiaCatalogData(): NvidiaCatalogData {
  const entries = nvidiaAiCoursesJson as NvidiaCourseEntry[];

  return {
    providers: [nvidiaProvider],
    courses: entries.map((entry) => {
      const topicIds = inferTopicIds(entry);
      const difficulty = inferDifficulty(entry);
      const pricingVerified = entry.pricingCategory !== "other";

      return {
        id: `course-nvidia-${slugify(entry.courseId)}`,
        title: entry.title,
        summary: buildSummary(entry),
        canonicalUrl: entry.canonicalUrl,
        enrollmentUrl: entry.canonicalUrl,
        providerId: nvidiaProvider.id,
        topicIds,
        skillIds: inferSkillIds(topicIds),
        difficulty,
        durationHours: entry.durationHours,
        languageCode: entry.languageCode,
        isFree: entry.pricingCategory === "free",
        freeVerificationStatus: pricingVerified ? "verified" : "unknown",
        freeVerifiedAt: verifiedAt,
        isActive: true,
        courseMode: entry.courseMode,
        hasCertificate: entry.hasCertificate,
        certificateIsFree: entry.pricingCategory === "free" && entry.hasCertificate,
        instructorName: "NVIDIA DLI",
        prerequisiteText: buildPrerequisiteText(entry, difficulty),
        syllabus: buildSyllabus(entry, topicIds),
        publishedAt: entry.publishedAt,
      } satisfies Course;
    }),
  };
}

const nvidiaCatalogData = createNvidiaCatalogData();

export function getNvidiaCatalogData() {
  return nvidiaCatalogData;
}
