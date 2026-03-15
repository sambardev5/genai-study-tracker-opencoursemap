import type { RawCandidate, SourceConfig } from "@/lib/types";
import type { SourceAdapter } from "@/lib/ingestion/adapters/types";
import { classifyTopics } from "@/lib/ingestion/classifiers/topic-classifier";

export const manualAdapter: SourceAdapter = {
  async fetchCandidates(source: SourceConfig) {
    const seed: RawCandidate[] = [
      {
        sourceId: source.id,
        url: `${source.baseUrl}/demo-course`,
        title: "Manual demo course",
        payload: {
          summary: "A manually curated intro to prompt engineering and MCP.",
        },
      },
    ];

    return seed;
  },
  async parseCandidate(candidate: RawCandidate) {
    const summary = String(candidate.payload?.summary ?? "Free manually curated learning resource.");

    return {
      canonicalUrl: candidate.url,
      title: candidate.title ?? "Untitled candidate",
      summary,
      providerName: "Manual curation",
      topicSlugs: classifyTopics(`${candidate.title ?? ""} ${summary}`),
      difficulty: "basic",
      durationHours: 2,
    };
  },
  async verifyCandidate() {
    return {
      isValid: true,
      isFree: true,
      freeVerificationStatus: "verified",
      issues: [],
    };
  },
};
