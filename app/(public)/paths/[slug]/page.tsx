import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCourseDuration } from "@/lib/utils";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        {path.items.map((item) => {
          const course = item.course;

          return (
            <Card key={item.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="default">Step {item.sequenceNo}</Badge>
                  <Badge tone={item.isRequired ? "success" : "muted"}>{item.isRequired ? "Required" : "Optional"}</Badge>
                </div>
                {course ? (
                  <Link href={`/courses/${course.id}`} className="mt-4 inline-block font-display text-2xl font-semibold text-ink hover:text-copper">
                    {course.title}
                  </Link>
                ) : (
                  <h2 className="mt-4 font-display text-2xl font-semibold">Course unavailable</h2>
                )}
                <p className="mt-2 text-sm leading-7 text-ink/68">{item.rationale}</p>
              </div>
              <div className="flex flex-col items-start gap-3 text-sm text-ink/56 md:items-end">
                <div>{course ? formatCourseDuration(course.durationHours, course.courseMode) : null}</div>
                {course ? (
                  <a
                    href={course.enrollmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-copper"
                  >
                    Open study URL
                  </a>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
