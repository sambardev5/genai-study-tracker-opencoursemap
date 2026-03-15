import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatHours } from "@/lib/utils";
import { repository } from "@/lib/db/repository";

export default async function LearningPathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = repository.getLearningPathBySlug(slug);

  if (!path) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Path detail" title={path.title} description={path.description} />
      <div className="mt-10 space-y-4">
        {path.items.map((item) => (
          <Card key={item.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="default">Step {item.sequenceNo}</Badge>
                <Badge tone={item.isRequired ? "success" : "muted"}>{item.isRequired ? "Required" : "Optional"}</Badge>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold">{item.course?.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink/68">{item.rationale}</p>
            </div>
            <div className="text-sm text-ink/56">{item.course ? formatHours(item.course.durationHours) : null}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
