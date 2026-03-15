import { notFound } from "next/navigation";
import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { repository } from "@/lib/db/repository";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = repository.getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const courses = repository
    .listCourses({ page: 1, pageSize: 24, sort: "relevance", topic: topic.id })
    .items;
  const providers = repository.getProviders();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Topic" title={topic.name} description={topic.description} />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            provider={providers.find((provider) => provider.id === course.providerId)}
            courseTopics={topics.filter((entry) => course.topicIds.includes(entry.id))}
          />
        ))}
      </div>
    </div>
  );
}
