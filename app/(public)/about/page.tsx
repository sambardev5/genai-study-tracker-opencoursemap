import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="An AI learning map with honest product boundaries"
        description="OpenCourseMap curates free and paid AI learning resources from tracked provider catalogs. We do not auto-enroll users, scrape arbitrary sites, or claim provider completion sync where it does not exist."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Discovery rules</h2>
          <p className="mt-4 text-sm leading-7 text-ink/68">
            Source ingestion is allowlist-based, uses structured metadata where possible, and keeps inactive
            history when providers change pricing.
          </p>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-semibold">Tracking rules</h2>
          <p className="mt-4 text-sm leading-7 text-ink/68">
            OpenCourseMap is the system of record for saved, enrolled, in-progress, and completed states,
            including optional evidence URLs and notes.
          </p>
        </Card>
      </div>
    </div>
  );
}
