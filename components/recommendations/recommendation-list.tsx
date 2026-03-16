import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCourseDuration } from "@/lib/utils";
import type { Course, RecommendationItem } from "@/lib/types";

export function RecommendationList({
  items,
}: {
  items: Array<RecommendationItem & { course?: Course | null }>;
}) {
  return (
    <div className="grid gap-5">
      {items.map((item) => (
        <Card key={item.courseId} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">Score {Math.round(item.score)}</Badge>
              {item.course ? <Badge tone="muted">{item.course.difficulty}</Badge> : null}
            </div>
            <h3 className="font-display text-2xl font-semibold">{item.course?.title ?? item.courseId}</h3>
            <p className="text-sm leading-7 text-ink/68">{item.reason}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink/58">
            {item.course ? <span>{formatCourseDuration(item.course.durationHours, item.course.courseMode)}</span> : null}
            <Link href={`/courses/${item.courseId}`} className="inline-flex items-center gap-2 font-semibold text-copper">
              Review course
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
