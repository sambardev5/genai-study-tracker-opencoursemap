import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { repository } from "@/lib/db/repository";

export default function AdminResourcesPage() {
  const courses = repository.listCourses({ page: 1, pageSize: 24, sort: "newest" }).items;
  const providers = repository.getProviders();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin resources"
        title="Review published resource metadata"
        description="This page is the initial content-ops surface for reclassification and metadata inspection."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            provider={providers.find((provider) => provider.id === course.providerId)}
            courseTopics={topics.filter((topic) => course.topicIds.includes(topic.id))}
          />
        ))}
      </div>
    </div>
  );
}
