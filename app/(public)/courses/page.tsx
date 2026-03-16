import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { CourseCard } from "@/components/courses/course-card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { repository } from "@/lib/db/repository";
import { parseCourseSearchParams } from "@/lib/search/params";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function buildPageHref(
  input: Record<string, string | string[] | undefined>,
  nextPage: number,
) {
  const params = buildSearchParams(input);

  if (nextPage <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(nextPage));
  }

  const query = params.toString();
  return query ? `/courses?${query}` : "/courses";
}

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((left, right) => left - right);
  const items: Array<number | "ellipsis"> = [];

  for (const page of sortedPages) {
    const previousPage = items[items.length - 1];

    if (typeof previousPage === "number" && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  }

  return items;
}

function PaginationNav({
  currentPage,
  totalPages,
  paginationItems,
  resolved,
  className,
}: {
  currentPage: number;
  totalPages: number;
  paginationItems: Array<number | "ellipsis">;
  resolved: Record<string, string | string[] | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Course catalog pagination"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      {currentPage > 1 ? (
        <Link
          href={buildPageHref(resolved, currentPage - 1)}
          rel="prev"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Previous
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-45")}>
          Previous
        </span>
      )}

      {paginationItems.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-ink/45">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageHref(resolved, item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={buttonVariants({
              variant: item === currentPage ? "primary" : "outline",
              size: "sm",
            })}
          >
            {item}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageHref(resolved, currentPage + 1)}
          rel="next"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Next
        </Link>
      ) : (
        <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-45")}>
          Next
        </span>
      )}
    </nav>
  );
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
  const paginationItems = getPaginationItems(data.pagination.page, data.pagination.totalPages);
  const firstResult = data.pagination.total === 0 ? 0 : (data.pagination.page - 1) * data.pagination.pageSize + 1;
  const lastResult =
    data.pagination.total === 0 ? 0 : Math.min(data.pagination.total, firstResult + data.items.length - 1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catalog"
        title="AI courses for modern practice"
        description="Search the merged catalog of free, paid, and price-not-stated AI, ML, robotics, simulation, agentic AI, evals, and AI engineering courses from the study guides plus vetted Microsoft, NVIDIA DLI, and Maven catalog sources."
      />

      <form className="mt-10 grid gap-4 rounded-[28px] border border-black/5 bg-white/70 p-5 shadow-card lg:grid-cols-8">
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
        <select name="pricing" defaultValue={filters.pricing} className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm">
          <option value="all">All pricing</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
          <option value="other">Price not stated</option>
        </select>
        <select name="mode" defaultValue={filters.mode} className="h-11 rounded-full border border-black/10 bg-white px-4 text-sm">
          <option value="">All modes</option>
          <option value="self-paced">Self-paced</option>
          <option value="live">Live workshop</option>
          <option value="cohort">Cohort</option>
          <option value="hybrid">Hybrid</option>
          <option value="unknown">Unknown</option>
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
          Showing {firstResult}-{lastResult} of {data.pagination.total} result
          {data.pagination.total === 1 ? "" : "s"}
        </span>
        <span>
          Page {data.pagination.page} of {data.pagination.totalPages}
        </span>
      </div>

      <PaginationNav
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
        paginationItems={paginationItems}
        resolved={resolved}
        className="mt-6 justify-start"
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {data.items.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            provider={providers.find((provider) => provider.id === course.providerId)}
            courseTopics={topics.filter((topic) => course.topicIds.includes(topic.id))}
            action={<Link href={course.enrollmentUrl} className="text-sm font-semibold text-copper">Open provider page</Link>}
          />
        ))}
      </div>

      <PaginationNav
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
        paginationItems={paginationItems}
        resolved={resolved}
        className="mt-10"
      />
    </div>
  );
}
