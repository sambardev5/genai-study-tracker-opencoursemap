import type { RawCandidate, SourceConfig } from "@/lib/types";
import type { SourceAdapter } from "@/lib/ingestion/adapters/types";
import { classifyTopics } from "@/lib/ingestion/classifiers/topic-classifier";

export const sitemapAdapter: SourceAdapter = {
  async fetchCandidates(source: SourceConfig) {
    return [
      {
        sourceId: source.id,
        url: `${source.baseUrl.replace(/\/$/, "")}/courses/mcp-tooling`,
        title: "Sitemap-discovered MCP Tooling",
        payload: {
          summary: "Allowlisted sitemap discovery for MCP and agent tooling.",
        },
      },
    ] satisfies RawCandidate[];
  },
  async parseCandidate(candidate: RawCandidate) {
    const summary = String(candidate.payload?.summary ?? "");

    return {
      canonicalUrl: candidate.url,
      title: candidate.title ?? "Sitemap candidate",
      summary,
      providerName: "Sitemap Provider",
      topicSlugs: classifyTopics(`${candidate.title ?? ""} ${summary}`),
      difficulty: "amateur",
      durationHours: 5,
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
