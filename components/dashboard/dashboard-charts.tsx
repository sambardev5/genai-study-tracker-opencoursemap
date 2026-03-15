"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";
import type { DashboardData } from "@/lib/types";

const chartColors = ["#21473e", "#b65e32", "#8ac9d1", "#b4c8a8", "#5d7d78"];

export function DashboardCharts({ data }: { data: DashboardData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {["Course status distribution", "Completed by topic", "Completions over time", "Skill gap coverage"].map(
          (title) => (
            <Card key={title} className="h-[340px]">
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <div className="mt-6 h-[250px] animate-pulse rounded-3xl bg-black/5" />
            </Card>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="h-[340px]">
        <h3 className="font-display text-xl font-semibold">Course status distribution</h3>
        <div className="mt-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.statusDistribution} dataKey="value" nameKey="name" outerRadius={90} fill="#21473e" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[340px]">
        <h3 className="font-display text-xl font-semibold">Completed by topic</h3>
        <div className="mt-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topicBreakdown}>
              <XAxis dataKey="topicName" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#b65e32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[340px]">
        <h3 className="font-display text-xl font-semibold">Completions over time</h3>
        <div className="mt-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.completionsOverTime}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stroke="#21473e" fill="#8ac9d1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="h-[340px]">
        <h3 className="font-display text-xl font-semibold">Skill gap coverage</h3>
        <div className="mt-6 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data.skillGaps}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skillName" tick={{ fontSize: 12 }} />
              <Radar dataKey="coverageScore" stroke={chartColors[0]} fill={chartColors[1]} fillOpacity={0.45} />
              <Tooltip formatter={(value) => formatPercent(Number(value ?? 0))} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
