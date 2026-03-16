import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseStatusActions } from "@/components/courses/course-status-actions";
import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { repository } from "@/lib/db/repository";
import { formatDate, formatHours } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = repository.getCourseById(id);

  return {
    title: course?.title ?? "Course",
    description: course?.summary,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = repository.getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <SectionHeading title={course.title} description={course.summary} />
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic) => (
              <Badge key={topic.id} tone="muted">
                {topic.name}
              </Badge>
            ))}
          </div>
          <Card>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-ink/45">Provider</div>
                <div className="mt-2 text-lg font-semibold">{course.provider?.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-ink/45">Duration</div>
                <div className="mt-2 text-lg font-semibold">{formatHours(course.durationHours)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-ink/45">Mode</div>
                <div className="mt-2 text-lg font-semibold">{course.courseMode}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-ink/45">Verified free</div>
                <div className="mt-2 text-lg font-semibold">{formatDate(course.freeVerifiedAt)}</div>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-ink/68">
              Enrollment happens on the provider website; progress tracking happens here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={course.enrollmentUrl} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas">
                Open provider enrollment
              </Link>
              <CourseStatusActions courseId={course.id} />
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl font-semibold">What you will cover</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-ink/70">
              {course.syllabus ?? "Syllabus not available."}
            </p>
          </Card>
        </div>

        <Card className="space-y-5">
          <h2 className="font-display text-2xl font-semibold">Recommended next</h2>
          {course.related.map((item) => (
            <div key={item.id} className="rounded-3xl border border-black/5 bg-white/70 p-4">
              <div className="font-semibold">{item.title}</div>
              <div className="mt-2 text-sm text-ink/58">{item.summary}</div>
              <Link href={`/courses/${item.id}`} className="mt-4 inline-block text-sm font-semibold text-copper">
                Review course
              </Link>
            </div>
          ))}
        </Card>
      </div>

      <section className="mt-16 space-y-6">
        <SectionHeading eyebrow="Related" title="Keep the path moving" />
        <div className="grid gap-6 lg:grid-cols-3">
          {course.related.map((item) => (
            <CourseCard
              key={item.id}
              course={item}
              provider={repository.getProviders().find((provider) => provider.id === item.providerId)}
              courseTopics={repository.getTopics().filter((topic) => item.topicIds.includes(topic.id))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
