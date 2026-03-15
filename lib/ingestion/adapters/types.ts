import type {
  ParsedCourseCandidate,
  ParsedRejection,
  RawCandidate,
  SourceConfig,
  VerificationResult,
} from "@/lib/types";

export interface SourceAdapter {
  fetchCandidates(source: SourceConfig): Promise<RawCandidate[]>;
  parseCandidate(candidate: RawCandidate): Promise<ParsedCourseCandidate | ParsedRejection>;
  verifyCandidate(candidate: ParsedCourseCandidate): Promise<VerificationResult>;
}
