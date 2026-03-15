import type { RawCandidate, SourceConfig } from "@/lib/types";
import type { SourceAdapter } from "@/lib/ingestion/adapters/types";
import { classifyTopics } from "@/lib/ingestion/classifiers/topic-classifier";

export const htmlAllowlistedAdapter: SourceAdapter = {
  async fetchCandidates(source: SourceConfig) {
    return [
      {
        sourceId: source.id,
        url: `${source.baseUrl.replace(/\/$/, "")}/free-ai-agents`,
        title: "Allowlisted AI Agents Course",
        payload: {
          summary: "HTML-parsed resource on AI agents with safety content.",
        },
      },
    ] satisfies RawCandidate[];
  },
  async parseCandidate(candidate: RawCandidate) {
    const summary = String(candidate.payload?.summary ?? "");

    return {
      canonicalUrl: candidate.url,
      title: candidate.title ?? "HTML candidate",
      summary,
      providerName: "HTML Allowlisted Provider",
      topicSlugs: classifyTopics(`${candidate.title ?? ""} ${summary}`),
      difficulty: "professional",
      durationHours: 7,
    };
  },
  async verifyCandidate() {
    return {
      isValid: true,
      isFree: true,
      freeVerificationStatus: "suspected",
      issues: ["Requires canonical URL verification."],
    };
  },
};
