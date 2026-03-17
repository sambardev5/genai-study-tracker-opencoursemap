import Link from "next/link";
import { ArrowRight, ChartColumnBig, Compass, GraduationCap, ShieldCheck } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  const catalog = repository.listCourses({
    page: 1,
    pageSize: 1,
    sort: "relevance",
  });
  const featured = repository.getHomepageFeaturedCourses(6);
  const learningPaths = repository.getLearningPaths();
  const providers = repository.getProviders();
  const topics = repository.getTopics();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-10 rounded-[36px] border border-black/5 bg-hero-grid bg-[size:32px_32px] p-8 shadow-card sm:p-10 lg:grid-cols-[1.3fr_0.9fr] lg:p-12">
        <div className="space-y-7">
          <Badge>Free and paid provider catalogs</Badge>
          <SectionHeading
            title="Discover AI courses worth your study time."
            description="Find free and paid LLM, MCP, Generative AI, ML, evals, prototyping, and agentic AI courses. Enroll on the provider site, then track progress, completions, and skill gaps here."
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/courses">
              <Button size="lg">
                Explore catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View dashboard
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white/75">
              <div className="text-3xl font-bold">{catalog.pagination.total}</div>
              <div className="mt-2 text-sm text-ink/60">Catalog synced from the study guides plus vetted Microsoft Learn, NVIDIA DLI AI, and Maven catalog pages.</div>
            </Card>
            <Card className="bg-white/75">
              <div className="text-3xl font-bold">{topics.length}</div>
              <div className="mt-2 text-sm text-ink/60">Core topic areas from foundations to production systems.</div>
            </Card>
            <Card className="bg-white/75">
              <div className="text-3xl font-bold">{providers.length}</div>
              <div className="mt-2 text-sm text-ink/60">Allowlisted providers with pricing-aware catalog tracking.</div>
            </Card>
          </div>
        </div>

        <Card className="bg-ink text-canvas">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-copper/25 p-3">
                <ChartColumnBig className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">System of record for progress</p>
                <p className="text-sm text-canvas/70">Enrollment stays with providers. Tracking stays with you.</p>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-7 text-canvas/78">
              <div className="flex gap-3">
                <Compass className="mt-1 h-4 w-4 shrink-0 text-sky" />
                Search and filter both free and paid provider offerings.
              </div>
              <div className="flex gap-3">
                <GraduationCap className="mt-1 h-4 w-4 shrink-0 text-sky" />
                Build beginner, amateur, and professional learning paths.
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-sky" />
                See free, paid, or price-not-stated status before committing time.
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-20 space-y-8">
        <SectionHeading
          eyebrow="Featured catalog"
          title="Start with a balanced, provider-diverse set."
          description="Foundational, intermediate, and advanced picks from different providers. Click Courses to explore the full AI catalog."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              provider={providers.find((provider) => provider.id === course.providerId)}
              courseTopics={topics.filter((topic) => course.topicIds.includes(topic.id))}
            />
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        {learningPaths.map((path) => (
          <Card key={path.id}>
            <Badge tone="success">{path.targetLevel}</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold">{path.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">{path.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-ink/56">
              <span>{path.items.length} courses</span>
              <Link href={`/paths/${path.slug}`} className="font-semibold text-copper">
                View path
              </Link>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
