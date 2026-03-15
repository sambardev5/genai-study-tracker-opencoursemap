import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { SectionHeading } from "@/components/layout/section-heading";
import { Card } from "@/components/ui/card";
import { requireCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";
import { formatHours, formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const dashboard = repository.getDashboard(user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Progress, coverage, and gaps"
        description="KPI cards and chart data are powered by the same dashboard aggregation that backs `/api/me/dashboard`."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-5">
        <Card>
          <div className="text-sm text-ink/58">Completed</div>
          <div className="mt-3 font-display text-4xl font-bold">{dashboard.summary.completed}</div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">In progress</div>
          <div className="mt-3 font-display text-4xl font-bold">
            {dashboard.statusDistribution.find((item) => item.name === "in_progress")?.value ?? 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">Hours invested</div>
          <div className="mt-3 font-display text-4xl font-bold">{formatHours(dashboard.summary.hoursInvested)}</div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">Completion rate</div>
          <div className="mt-3 font-display text-4xl font-bold">{formatPercent(dashboard.summary.completionRate)}</div>
        </Card>
        <Card>
          <div className="text-sm text-ink/58">Strongest topic</div>
          <div className="mt-3 text-lg font-semibold">{dashboard.summary.strongestTopic ?? "No data yet"}</div>
        </Card>
      </div>

      <div className="mt-10">
        <DashboardCharts data={dashboard} />
      </div>
    </div>
  );
}
