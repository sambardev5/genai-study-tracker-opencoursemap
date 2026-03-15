import type { ParsedCourseCandidate, VerificationResult } from "@/lib/types";

export async function verifyParsedCandidate(candidate: ParsedCourseCandidate): Promise<VerificationResult> {
  const issues: string[] = [];

  if (!candidate.title.trim()) {
    issues.push("Missing title");
  }

  if (candidate.topicSlugs.length === 0) {
    issues.push("No topic classification");
  }

  return {
    isValid: issues.length === 0,
    isFree: true,
    freeVerificationStatus: issues.length === 0 ? "verified" : "unknown",
    issues,
  };
}
