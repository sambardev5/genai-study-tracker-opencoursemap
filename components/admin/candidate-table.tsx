import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { IngestionCandidate } from "@/lib/types";

export function CandidateTable({ items }: { items: IngestionCandidate[] }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-black/5 text-left text-sm">
          <thead className="bg-black/[0.03]">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Confidence</th>
              <th className="px-5 py-3 font-semibold">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 bg-white/50">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4">{item.title ?? "Untitled candidate"}</td>
                <td className="px-5 py-4">
                  <Badge tone={item.parseStatus === "approved" ? "success" : item.parseStatus === "rejected" ? "warning" : "default"}>
                    {item.parseStatus}
                  </Badge>
                </td>
                <td className="px-5 py-4">{Math.round(item.confidenceScore * 100)}%</td>
                <td className="px-5 py-4">
                  <a href={item.discoveredUrl} className="text-copper underline underline-offset-4">
                    {item.discoveredUrl}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
