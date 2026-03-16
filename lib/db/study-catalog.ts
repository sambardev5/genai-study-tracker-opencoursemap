import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { slugify } from "@/lib/utils";
import type { Course, CourseLevel, LearningPath, Provider } from "@/lib/types";

type StudyEntry = {
  index: number;
  provider: string;
  course: string;
  url: string;
  credential: string;
  sourceFile: string;
};

type StudyCatalogData = {
  entries: StudyEntry[];
  providers: Provider[];
  courses: Course[];
  learningPaths: LearningPath[];
};

const verifiedAt = "2026-03-15T09:00:00.000Z";
const ibmSkillsBuildCatalogUrl = "https://skillsbuild.org/students/course-catalog/artificial-intelligence";
const studySourceConfigs = [
  {
    path: join(process.cwd(), "study.md"),
    sourceFile: "study.md",
    mapCells(cells: [string, string, string, string, string]) {
      const [indexCell, provider, course, url, credential] = cells;

      return {
        indexCell,
        provider,
        course,
        url,
        credential,
      };
    },
  },
  {
    path: join(process.cwd(), "study_150_courses.md"),
    sourceFile: "study_150_courses.md",
    mapCells(cells: [string, string, string, string, string]) {
      const [indexCell, course, provider, url, credential] = cells;

      return {
        indexCell,
        provider,
        course,
        url,
        credential,
      };
    },
  },
] as const;

const providerAliases: Record<
  string,
  Pick<Provider, "id" | "name" | "websiteUrl" | "providerType"> & { instructorName?: string }
> = {
  "Google for Developers": {
    id: "provider-google",
    name: "Google",
    websiteUrl: "https://developers.google.com",
    providerType: "docs",
  },
  "Google Cloud Skills Boost": {
    id: "provider-google",
    name: "Google",
    websiteUrl: "https://www.cloudskillsboost.google",
    providerType: "docs",
  },
  "Microsoft Learn": {
    id: "provider-microsoft",
    name: "Microsoft",
    websiteUrl: "https://learn.microsoft.com",
    providerType: "docs",
  },
  "Kaggle Learn": {
    id: "provider-kaggle",
    name: "Kaggle",
    websiteUrl: "https://www.kaggle.com/learn",
    providerType: "community",
  },
  "DeepLearning.AI": {
    id: "provider-deeplearning",
    name: "DeepLearning.AI",
    websiteUrl: "https://www.deeplearning.ai",
    providerType: "community",
  },
  "Hugging Face": {
    id: "provider-hf",
    name: "Hugging Face",
    websiteUrl: "https://huggingface.co/learn",
    providerType: "community",
  },
  "IBM SkillsBuild": {
    id: "provider-ibm",
    name: "IBM SkillsBuild",
    websiteUrl: ibmSkillsBuildCatalogUrl,
    providerType: "community",
  },
  "Harvard CS50": {
    id: "provider-harvard-cs50",
    name: "Harvard CS50",
    websiteUrl: "https://cs50.harvard.edu",
    providerType: "university",
  },
  "fast.ai": {
    id: "provider-fast-ai",
    name: "fast.ai",
    websiteUrl: "https://course.fast.ai",
    providerType: "community",
  },
  AWS: {
    id: "provider-aws",
    name: "AWS",
    websiteUrl: "https://aws.amazon.com",
    providerType: "community",
  },
  "AWS Training": {
    id: "provider-aws",
    name: "AWS",
    websiteUrl: "https://aws.amazon.com/training/",
    providerType: "community",
  },
  Google: {
    id: "provider-google",
    name: "Google",
    websiteUrl: "https://developers.google.com",
    providerType: "docs",
  },
  "Coursera (Free Audit)": {
    id: "provider-coursera",
    name: "Coursera",
    websiteUrl: "https://www.coursera.org",
    providerType: "mooc",
  },
  "edX (Audit Free)": {
    id: "provider-edx",
    name: "edX",
    websiteUrl: "https://www.edx.org",
    providerType: "mooc",
  },
  "NVIDIA DLI": {
    id: "provider-nvidia-dli",
    name: "NVIDIA DLI",
    websiteUrl: "https://www.nvidia.com/en-us/training/",
    providerType: "community",
  },
};

const topicLabels: Record<string, string> = {
  "topic-llm": "LLM systems",
  "topic-mcp": "MCP",
  "topic-genai": "generative AI",
  "topic-ml": "machine learning",
  "topic-prompt": "prompt engineering",
  "topic-rag": "RAG",
  "topic-vector": "vector search",
  "topic-agents": "AI agents",
  "topic-finetune": "fine-tuning",
  "topic-eval": "evaluation",
  "topic-mlops": "MLOps",
  "topic-rai": "responsible AI",
  "topic-data": "data science",
  "topic-copilot": "copilots",
  "topic-cv": "computer vision",
  "topic-multimodal": "multimodal AI",
  "topic-rl": "reinforcement learning",
};

const difficultyRank: Record<Exclude<CourseLevel, "unknown">, number> = {
  basic: 0,
  amateur: 1,
  professional: 2,
};

function readStudyEntriesFromFile(config: (typeof studySourceConfigs)[number]): StudyEntry[] {
  if (!existsSync(config.path)) {
    return [];
  }

  const content = readFileSync(config.path, "utf8");
  const lines = content.split(/\r?\n/);
  const entries: StudyEntry[] = [];

  for (const line of lines) {
    if (!line.startsWith("|")) {
      continue;
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== 5 || cells[0] === "#") {
      continue;
    }

    const mapped = config.mapCells(cells as [string, string, string, string, string]);
    const index = Number.parseInt(mapped.indexCell, 10);

    if (Number.isNaN(index)) {
      continue;
    }

    entries.push({
      index,
      provider: mapped.provider,
      course: mapped.course,
      url: mapped.url,
      credential: mapped.credential,
      sourceFile: config.sourceFile,
    });
  }

  return entries;
}

function inferTopicIds(entry: StudyEntry) {
  const normalized = `${entry.provider} ${entry.course} ${entry.url}`.toLowerCase();
  const topicIds: string[] = [];

  const pushTopic = (topicId: string, keywords: string[]) => {
    if (keywords.some((keyword) => normalized.includes(keyword)) && !topicIds.includes(topicId)) {
      topicIds.push(topicId);
    }
  };

  pushTopic("topic-mcp", ["model context protocol", "mcp"]);
  pushTopic("topic-agents", ["agent", "agents", "chatbot", "copilot studio", "agentic"]);
  pushTopic("topic-rag", ["rag", "retrieval", "your data", "search-augmented"]);
  pushTopic("topic-vector", ["vector database", "vector databases", "embeddings"]);
  pushTopic("topic-prompt", ["prompt"]);
  pushTopic("topic-finetune", ["finetuning", "fine-tuning"]);
  pushTopic("topic-copilot", ["copilot", "workspace with gemini", "gemini in gmail", "gemini in google docs", "gemini in google sheets"]);
  pushTopic("topic-llm", ["llm", "language model", "language models", "chatgpt", "gemini", "foundry"]);
  pushTopic("topic-genai", ["generative ai", "genai", "gen ai", "chatgpt", "gemini", "foundry", "diffusion"]);
  pushTopic("topic-rai", ["responsible ai", "ethics", "secure your data", "securing ai", "govern", "defend", "adversarial testing", "explainability"]);
  pushTopic("topic-eval", ["evaluation", "evaluating", "explainability", "adversarial testing", "debugging"]);
  pushTopic("topic-mlops", ["mlops", "production machine learning", "machine learning in production", "deploy", "manage", "production", "real-time", "fabric", "databricks"]);
  pushTopic("topic-data", ["data science", "data analysis", "feature engineering", "time series", "fabric", "databricks", "good data analysis", "data traps"]);
  pushTopic("topic-cv", ["computer vision", "vision"]);
  pushTopic("topic-multimodal", ["audio", "diffusion", "computer vision", "robotics", "multimodal"]);
  pushTopic("topic-rl", ["reinforcement learning", "deepracer"]);
  pushTopic("topic-ml", ["machine learning", "deep learning", "tensorflow", "decision forests", "clustering", "recommendation", "gan", "problem framing", "rules of ml", "watsonx"]);

  if (topicIds.length === 0) {
    topicIds.push(normalized.includes("machine learning") ? "topic-ml" : "topic-genai");
  }

  if (topicIds.includes("topic-mcp") && !topicIds.includes("topic-agents")) {
    topicIds.push("topic-agents");
  }

  if (topicIds.includes("topic-llm") && !topicIds.includes("topic-genai")) {
    topicIds.push("topic-genai");
  }

  if (topicIds.includes("topic-genai") && !topicIds.includes("topic-llm") && normalized.includes("llm")) {
    topicIds.push("topic-llm");
  }

  return topicIds.slice(0, 4);
}

function inferDifficulty(entry: StudyEntry, topicIds: string[]): Exclude<CourseLevel, "unknown"> {
  const normalized = `${entry.course} ${entry.provider}`.toLowerCase();

  if (
    normalized.includes("advanced") ||
    normalized.includes("production") ||
    normalized.includes("mlops") ||
    normalized.includes("secure") ||
    normalized.includes("securing") ||
    normalized.includes("govern") ||
    normalized.includes("defend") ||
    normalized.includes("real-time") ||
    normalized.includes("databricks") ||
    normalized.includes("analytics engineering")
  ) {
    return "professional";
  }

  if (
    normalized.includes("intermediate") ||
    normalized.includes("build") ||
    normalized.includes("developer") ||
    normalized.includes("develop") ||
    normalized.includes("practitioner") ||
    normalized.includes("specialization") ||
    normalized.includes("course") ||
    normalized.includes("pathway") ||
    topicIds.includes("topic-rag") ||
    topicIds.includes("topic-agents") ||
    topicIds.includes("topic-mcp")
  ) {
    return "amateur";
  }

  return "basic";
}

function inferSkillIds(topicIds: string[]) {
  const skillIds = new Set<string>();

  if (topicIds.some((topicId) => topicId === "topic-rag" || topicId === "topic-vector")) {
    skillIds.add("skill-rag-architecture");
  }

  if (topicIds.some((topicId) => topicId === "topic-prompt" || topicId === "topic-genai" || topicId === "topic-llm")) {
    skillIds.add("skill-prompt-evals");
    skillIds.add("skill-model-selection");
  }

  if (topicIds.some((topicId) => topicId === "topic-agents" || topicId === "topic-mcp")) {
    skillIds.add("skill-agent-tooling");
  }

  if (topicIds.some((topicId) => topicId === "topic-rai" || topicId === "topic-eval")) {
    skillIds.add("skill-safety-review");
  }

  if (topicIds.some((topicId) => topicId === "topic-ml" || topicId === "topic-data")) {
    skillIds.add("skill-feature-engineering");
    skillIds.add("skill-data-analysis");
  }

  if (topicIds.includes("topic-mlops")) {
    skillIds.add("skill-mlops-operations");
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

function normalizeStudyUrl(entry: StudyEntry) {
  if (entry.provider === "IBM SkillsBuild") {
    return ibmSkillsBuildCatalogUrl;
  }

  return entry.url;
}

function getProviderSeed(entry: StudyEntry): Provider {
  const alias = providerAliases[entry.provider];

  if (alias) {
    return {
      ...alias,
      isActive: true,
    };
  }

  const origin = new URL(normalizeStudyUrl(entry)).origin;

  return {
    id: `provider-${slugify(entry.provider)}`,
    name: entry.provider,
    websiteUrl: origin,
    providerType: "other",
    isActive: true,
  };
}

function buildSummary(entry: StudyEntry, topicIds: string[]) {
  const topicSummary = topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .slice(0, 2)
    .join(" and ");
  const credential = entry.credential.toLowerCase();
  const credentialSummary =
    credential === "not stated"
      ? ""
      : credential === "yes"
        ? " Includes a free certificate."
        : credential.includes("optional/paid")
          ? " Certificate access is optional or paid."
          : ` Includes a documented ${credential}.`;

  return `${entry.provider}'s official study resource covering ${topicSummary || "AI learning pathways"}.${credentialSummary}`;
}

function buildPrerequisiteText(level: Exclude<CourseLevel, "unknown">) {
  if (level === "professional") {
    return "Best after foundational AI and implementation experience.";
  }

  if (level === "amateur") {
    return "Helpful if you already know the basics of AI, ML, or coding workflows.";
  }

  return "Designed as an accessible starting point for this topic.";
}

function buildSyllabus(topicIds: string[]) {
  return topicIds
    .map((topicId) => topicLabels[topicId])
    .filter(Boolean)
    .join(", ");
}

function getCertificateFlags(credential: string) {
  const normalized = credential.trim().toLowerCase();

  if (!normalized || normalized === "not stated") {
    return {
      hasCertificate: false,
      certificateIsFree: false,
    };
  }

  if (normalized === "yes") {
    return {
      hasCertificate: true,
      certificateIsFree: true,
    };
  }

  if (normalized.includes("optional/paid") || normalized.includes("paid")) {
    return {
      hasCertificate: true,
      certificateIsFree: false,
    };
  }

  return {
    hasCertificate: true,
    certificateIsFree: true,
  };
}

const sourceOrder = new Map<string, number>(
  studySourceConfigs.map((config, index) => [config.sourceFile, index] as const),
);

function buildPathItems(pathId: string, courseList: Course[]) {
  return courseList.map((course, index) => ({
    id: `${pathId}-${index + 1}`,
    courseId: course.id,
    sequenceNo: index + 1,
    isRequired: index < Math.min(3, courseList.length),
    rationale:
      index === 0
        ? "Starts with a solid on-ramp into the topic."
        : index === courseList.length - 1
          ? "Rounds out the path with broader depth or specialization."
          : "Builds on the previous step with a complementary provider angle.",
  }));
}

function selectPathCourses(courses: Course[], courseIndex: Map<string, number>, topicIds: string[]) {
  return courses
    .filter((course) => course.topicIds.some((topicId) => topicIds.includes(topicId)))
    .sort((left, right) => {
      const difficultyDiff =
        difficultyRank[left.difficulty as Exclude<CourseLevel, "unknown">] -
        difficultyRank[right.difficulty as Exclude<CourseLevel, "unknown">];

      if (difficultyDiff !== 0) {
        return difficultyDiff;
      }

      return (courseIndex.get(left.id) ?? 0) - (courseIndex.get(right.id) ?? 0);
    });
}

const pathConfigs: Array<{
  id: string;
  slug: string;
  title: string;
  description: string;
  targetLevel: Exclude<CourseLevel, "unknown">;
  topicId: string;
  matchTopicIds: string[];
}> = [
  {
    id: "path-study-ml-foundations",
    slug: "machine-learning-foundations-study-guide",
    title: "Machine Learning Foundations Study Guide",
    description: "Foundational ML and data-science resources spanning Google, Kaggle, IBM, CS50, and fast.ai.",
    targetLevel: "basic",
    topicId: "topic-ml",
    matchTopicIds: ["topic-ml", "topic-data"],
  },
  {
    id: "path-study-genai-essentials",
    slug: "genai-essentials-study-guide",
    title: "GenAI Essentials Study Guide",
    description: "Core generative AI, prompting, and LLM foundations from Microsoft, DeepLearning.AI, Google, and AWS.",
    targetLevel: "basic",
    topicId: "topic-genai",
    matchTopicIds: ["topic-genai", "topic-prompt", "topic-llm"],
  },
  {
    id: "path-study-rag-and-llm-apps",
    slug: "rag-and-llm-applications-study-guide",
    title: "RAG and LLM Applications Study Guide",
    description: "Practical application-building track for retrieval, vector search, fine-tuning, and LLM systems work.",
    targetLevel: "amateur",
    topicId: "topic-rag",
    matchTopicIds: ["topic-rag", "topic-vector", "topic-finetune"],
  },
  {
    id: "path-study-agents-and-mcp",
    slug: "agents-and-mcp-study-guide",
    title: "Agents and MCP Study Guide",
    description: "Agent workflows, assistant-building, MCP foundations, and Copilot extension resources grouped together.",
    targetLevel: "amateur",
    topicId: "topic-agents",
    matchTopicIds: ["topic-agents", "topic-mcp", "topic-copilot"],
  },
  {
    id: "path-study-responsible-ai",
    slug: "responsible-ai-and-evals-study-guide",
    title: "Responsible AI and Evals Study Guide",
    description: "Governance, safety, evaluation, ethics, and AI risk-management resources.",
    targetLevel: "professional",
    topicId: "topic-rai",
    matchTopicIds: ["topic-rai", "topic-eval"],
  },
  {
    id: "path-study-production-ai",
    slug: "production-ai-and-mlops-study-guide",
    title: "Production AI and MLOps Study Guide",
    description: "Deployment, operations, analytics engineering, and production ML workflows for real systems.",
    targetLevel: "professional",
    topicId: "topic-mlops",
    matchTopicIds: ["topic-mlops", "topic-data", "topic-ml"],
  },
  {
    id: "path-study-multimodal",
    slug: "multimodal-and-vision-study-guide",
    title: "Multimodal and Vision Study Guide",
    description: "Vision, audio, diffusion, robotics, and reinforcement-learning resources for broader AI systems.",
    targetLevel: "amateur",
    topicId: "topic-multimodal",
    matchTopicIds: ["topic-multimodal", "topic-cv", "topic-rl"],
  },
];

export function getStudyCatalogData(): StudyCatalogData {
  const entries = studySourceConfigs.flatMap(readStudyEntriesFromFile);

  const providers = Array.from(
    new Map(
      entries.map((entry) => {
        const provider = getProviderSeed(entry);
        return [provider.id, provider] as const;
      }),
    ).values(),
  );

  const courses = entries.map((entry) => {
    const provider = getProviderSeed(entry);
    const topicIds = inferTopicIds(entry);
    const difficulty = inferDifficulty(entry, topicIds);
    const certificate = getCertificateFlags(entry.credential);
    const normalizedUrl = normalizeStudyUrl(entry);

    return {
      id: `study-${slugify(`${entry.sourceFile}-${entry.index}-${provider.id}-${entry.course}`)}`,
      title: entry.course,
      summary: buildSummary(entry, topicIds),
      canonicalUrl: normalizedUrl,
      enrollmentUrl: normalizedUrl,
      providerId: provider.id,
      topicIds,
      skillIds: inferSkillIds(topicIds),
      difficulty,
      durationHours: null,
      languageCode: "en",
      isFree: true,
      freeVerificationStatus: "verified",
      freeVerifiedAt: verifiedAt,
      isActive: true,
      courseMode: "self-paced",
      hasCertificate: certificate.hasCertificate,
      certificateIsFree: certificate.certificateIsFree,
      instructorName: entry.provider,
      prerequisiteText: buildPrerequisiteText(difficulty),
      syllabus: buildSyllabus(topicIds),
      publishedAt: verifiedAt,
    } satisfies Course;
  });

  const courseIndex = new Map<string, number>(
    entries.map((entry) => {
      const provider = getProviderSeed(entry);
      const orderValue = (sourceOrder.get(entry.sourceFile) ?? 0) * 1000 + entry.index;

      return [
        `study-${slugify(`${entry.sourceFile}-${entry.index}-${provider.id}-${entry.course}`)}`,
        orderValue,
      ] as const;
    }),
  );

  const learningPaths = pathConfigs
    .map((config) => {
      const selectedCourses = selectPathCourses(courses, courseIndex, config.matchTopicIds);

      return {
        id: config.id,
        slug: config.slug,
        title: config.title,
        description: config.description,
        targetLevel: config.targetLevel,
        topicId: config.topicId,
        isPublished: selectedCourses.length >= 3,
        items: buildPathItems(config.id, selectedCourses),
      } satisfies LearningPath;
    })
    .filter((path) => path.isPublished);

  return {
    entries,
    providers,
    courses,
    learningPaths,
  };
}

const studyCatalogSnapshot = getStudyCatalogData();

export const studyProviders = studyCatalogSnapshot.providers;
export const studyCourses = studyCatalogSnapshot.courses;
export const studyLearningPaths = studyCatalogSnapshot.learningPaths;
