import Link from "next/link";
import { ArrowUpRight, Clock3, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCourseDuration, formatDate } from "@/lib/utils";
import type { Course, Provider, Topic } from "@/lib/types";

export function CourseCard({
  course,
  provider,
  courseTopics,
  action,
}: {
  course: Course;
  provider?: Provider | null;
  courseTopics?: Topic[];
  action?: React.ReactNode;
}) {
  const pricingTone = course.isFree
    ? course.freeVerificationStatus === "verified"
      ? "success"
      : "warning"
    : course.freeVerificationStatus === "verified"
      ? "muted"
      : "warning";
  const pricingLabel = course.isFree
    ? course.freeVerificationStatus === "verified"
      ? "Verified free"
      : "Free / needs re-check"
    : course.freeVerificationStatus === "verified"
      ? "Paid"
      : "Pricing not stated";

  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone={pricingTone}>{pricingLabel}</Badge>
            <Badge tone="muted">{course.difficulty}</Badge>
          </div>
          <div>
            <Link href={`/courses/${course.id}`} className="group inline-flex items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight">{course.title}</h2>
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-ink/45">
              {provider?.name ?? "Unknown provider"}
            </p>
          </div>
        </div>
        {action}
      </div>

      <p className="flex-1 text-sm leading-7 text-ink/72">{course.summary}</p>

      <div className="flex flex-wrap gap-2">
        {courseTopics?.map((topic) => <Badge key={topic.id} tone="muted">{topic.name}</Badge>)}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-ink/60">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {formatCourseDuration(course.durationHours, course.courseMode)}
        </span>
        <span className="inline-flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          {course.courseMode}
        </span>
        <span>Checked {formatDate(course.freeVerifiedAt)}</span>
      </div>
    </Card>
  );
}
