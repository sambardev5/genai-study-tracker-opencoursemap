import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { CourseCard } from "@/components/courses/course-card";
import { Input } from "@/components/ui/input";
import { repository } from "@/lib/db/repository";
import { parseCourseSearchParams } from "@/lib/search/params";

function buildSearchParams(input: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
    } else if (value) {
      params.set(key, value);
    }
  }

  return params;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = (await searchParams) ?? {};
  const filters = parseCourseSearchParams(buildSearchParams(resolved));
  const data = repository.listCourses(filters);
  const providers = repository.getProviders();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catalog"
        title="Free courses for modern AI practice"
        description="Search official free AI learning resources from OpenAI, Anthropic, Microsoft, Google, AWS, IBM, LinkedIn, Perplexity, Meta, Tesla, and the existing MVP providers."
      />

      <form className="mt-10 grid gap-4 rounded-[28px] border border-black/5 bg-white/70 p-5 shadow-card lg:grid-cols-6">
        <Input name="q" placeholder="Search by title or topic" defaultValue={filters.q} className="lg:col-span-2" />
        <select name="topic" defaultValue={filters.topic} className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm">
          <option value="">All topics</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        <select name="provider" defaultValue={filters.provider} className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm">
          <option value="">All providers</option>
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
        <select name="level" defaultValue={filters.level} className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm">
          <option value="">All levels</option>
          <option value="basic">Basic</option>
          <option value="amateur">Amateur</option>
          <option value="professional">Professional</option>
        </select>
        <button className="h-11 rounded-full bg-ink px-4 text-sm font-semibold text-canvas">Apply filters</button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-ink/58">
        <span>
          {data.pagination.total} result{data.pagination.total === 1 ? "" : "s"}
        </span>
        <span>
          Page {data.pagination.page} of {data.pagination.totalPages}
        </span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {data.items.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            provider={providers.find((provider) => provider.id === course.providerId)}
            courseTopics={topics.filter((topic) => course.topicIds.includes(topic.id))}
            action={<Link href={course.enrollmentUrl} className="text-sm font-semibold text-copper">Enroll externally</Link>}
          />
        ))}
      </div>
    </div>
  );
}
