import { CourseStatusActions } from "@/components/courses/course-status-actions";
import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { requireCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";

export default async function MyCoursesPage() {
  const user = await requireCurrentUser();
  const items = repository.getUserCourseStatuses(user.id);
  const providers = repository.getProviders();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="My courses"
        title="Your external enrollments and completions"
        description="These statuses live inside OpenCourseMap even though enrollment happens on the provider site."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {items.map((item) =>
          item.course ? (
            <CourseCard
              key={item.id}
              course={item.course}
              provider={providers.find((provider) => provider.id === item.course?.providerId)}
              courseTopics={topics.filter((topic) => item.course?.topicIds.includes(topic.id))}
              action={<CourseStatusActions courseId={item.course.id} currentStatus={item.status} />}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
