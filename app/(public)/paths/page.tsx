import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { repository } from "@/lib/db/repository";

export default function LearningPathsPage() {
  const paths = repository.getLearningPaths();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Learning paths"
        title="Guided tracks from fundamentals to production"
        description="The MVP uses deterministic path sequencing instead of opaque black-box recommendations."
      />
      <div className="mt-10 grid gap-6">
        {paths.map((path) => (
          <Card key={path.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="success">{path.targetLevel}</Badge>
                  <Badge tone="muted">{topics.find((topic) => topic.id === path.topicId)?.name}</Badge>
                </div>
                <h2 className="mt-4 font-display text-3xl font-semibold">{path.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/68">{path.description}</p>
              </div>
              <Link href={`/paths/${path.slug}`} className="text-sm font-semibold text-copper">
                Review path
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
