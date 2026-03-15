import { SectionHeading } from "@/components/layout/section-heading";
import { RecommendationList } from "@/components/recommendations/recommendation-list";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";

export default async function RecommendationsPage() {
  const user = await getCurrentUser();
  const recommendations = repository.getRecommendations(user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Recommendations"
        title="Next best courses for your path"
        description="The MVP uses a deterministic weighted scoring model based on level fit, topic preference, provider preference, prerequisite coverage, duration, and freshness."
      />
      <div className="mt-10">
        <RecommendationList items={recommendations} />
      </div>
    </div>
  );
}
