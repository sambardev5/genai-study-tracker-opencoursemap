import { CandidateDecisionButtons, RunIngestionButton } from "@/components/admin/admin-actions";
import { CandidateTable } from "@/components/admin/candidate-table";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";
import { repository } from "@/lib/db/repository";

export default function AdminIngestionPage() {
  const candidates = repository.listCandidates();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin ingestion"
        title="Review candidates before publish"
        description="Manual review is built into the MVP for any low-confidence or pricing-sensitive candidate."
      />
      <div className="mt-8 flex justify-end">
        <RunIngestionButton />
      </div>
      <div className="mt-8 grid gap-6">
        <CandidateTable items={candidates} />
        <div className="grid gap-4 md:grid-cols-2">
          {candidates
            .filter((candidate) => candidate.parseStatus === "needs_review")
            .map((candidate) => (
              <Card key={candidate.id} className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold">{candidate.title}</div>
                  <div className="mt-1 text-sm text-ink/58">{candidate.discoveredUrl}</div>
                </div>
                <CandidateDecisionButtons candidateId={candidate.id} />
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
