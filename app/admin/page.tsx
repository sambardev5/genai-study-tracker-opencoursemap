import Link from "next/link";
import { RunIngestionButton } from "@/components/admin/admin-actions";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";
import { repository } from "@/lib/db/repository";

export default function AdminPage() {
  const snapshot = repository.getAdminSnapshot();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin"
        title="Content operations and ingestion review"
        description="Admin endpoints are implemented behind server-side authorization checks and a simple repository abstraction."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="text-sm text-ink/58">Sources</div>
          <div className="mt-3 font-display text-4xl font-bold">{snapshot.sources.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">Source runs</div>
          <div className="mt-3 font-display text-4xl font-bold">{snapshot.sourceRuns.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">Candidates</div>
          <div className="mt-3 font-display text-4xl font-bold">{snapshot.candidates.length}</div>
        </Card>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <RunIngestionButton />
        <Link href="/admin/ingestion" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
          Review candidates
        </Link>
        <Link href="/admin/resources" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">
          Manage resources
        </Link>
      </div>
    </div>
  );
}
