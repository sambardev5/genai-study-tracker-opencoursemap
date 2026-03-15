import type { RawCandidate, SourceConfig } from "@/lib/types";
import type { SourceAdapter } from "@/lib/ingestion/adapters/types";
import { classifyTopics } from "@/lib/ingestion/classifiers/topic-classifier";

export const rssAdapter: SourceAdapter = {
  async fetchCandidates(source: SourceConfig) {
    return [
      {
        sourceId: source.id,
        url: `${source.baseUrl.replace(/\/$/, "")}/course-rag`,
        title: "RSS Imported RAG Course",
        payload: {
          summary: "RAG and evaluation course from an allowlisted feed.",
        },
      },
    ] satisfies RawCandidate[];
  },
  async parseCandidate(candidate: RawCandidate) {
    const summary = String(candidate.payload?.summary ?? "");

    return {
      canonicalUrl: candidate.url,
      title: candidate.title ?? "Imported course",
      summary,
      providerName: "RSS Provider",
      topicSlugs: classifyTopics(`${candidate.title ?? ""} ${summary}`),
      difficulty: "amateur",
      durationHours: 6,
    };
  },
  async verifyCandidate() {
    return {
      isValid: true,
      isFree: true,
      freeVerificationStatus: "suspected",
      issues: ["Requires human review for price confirmation."],
    };
  },
};
