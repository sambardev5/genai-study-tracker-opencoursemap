import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";

export default async function ProfilePage() {
  const user = await requireCurrentUser();
  const preferences = repository.getPreferences(user.id);
  const topics = repository.getTopics();
  const providers = repository.getProviders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Profile" title={user.fullName} description={user.headline} />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-semibold">Profile summary</h2>
          <dl className="mt-5 space-y-3 text-sm text-ink/68">
            <div className="flex justify-between gap-4">
              <dt>Current level</dt>
              <dd className="font-semibold text-ink">{user.currentLevel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Weekly study hours</dt>
              <dd className="font-semibold text-ink">{user.weeklyStudyHours}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Email</dt>
              <dd className="font-semibold text-ink">{user.email}</dd>
            </div>
          </dl>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-semibold">Preferences</h2>
          <p className="mt-4 text-sm leading-7 text-ink/68">{preferences.goalText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {preferences.preferredTopics.map((topicId) => (
              <Badge key={topicId} tone="muted">
                {topics.find((topic) => topic.id === topicId)?.name}
              </Badge>
            ))}
            {preferences.preferredProviders.map((providerId) => (
              <Badge key={providerId}>{providers.find((provider) => provider.id === providerId)?.name}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
