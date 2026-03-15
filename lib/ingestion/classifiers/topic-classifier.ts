import { topics } from "@/lib/db/demo-data";

const mappings: Record<string, string[]> = {
  rag: ["rag", "retrieval augmented generation", "retrieval-augmented generation"],
  "prompt-engineering": ["prompt engineering", "prompt design", "system prompts"],
  mcp: ["model context protocol", "mcp"],
  slm: ["small language model", "slm"],
  "ai-agents": ["agent", "agents", "tool use", "tool calling"],
  evaluation: ["evaluation", "eval", "benchmark"],
};

export function classifyTopics(text: string) {
  const normalized = text.toLowerCase();
  const matches = Object.entries(mappings)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([slug]) => topics.find((topic) => topic.slug === slug)?.slug)
    .filter((slug): slug is string => Boolean(slug));

  return [...new Set(matches)];
}
