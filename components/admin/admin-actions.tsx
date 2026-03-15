"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RunIngestionButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);

    try {
      await fetch("/api/admin/ingestion/run", { method: "POST" });
      router.refresh();
    } finally {
      startTransition(() => setPending(false));
    }
  }

  return (
    <Button onClick={handleClick} disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Trigger ingestion run
    </Button>
  );
}

export function CandidateDecisionButtons({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);

  async function act(action: "approve" | "reject") {
    setPendingAction(action);

    try {
      await fetch(`/api/admin/ingestion/candidates/${candidateId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: action === "reject" ? JSON.stringify({ reason: "Rejected during admin review." }) : undefined,
      });
      router.refresh();
    } finally {
      startTransition(() => setPendingAction(null));
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={() => act("approve")} disabled={Boolean(pendingAction)}>
        {pendingAction === "approve" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Approve
      </Button>
      <Button size="sm" variant="outline" onClick={() => act("reject")} disabled={Boolean(pendingAction)}>
        {pendingAction === "reject" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Reject
      </Button>
    </div>
  );
}
