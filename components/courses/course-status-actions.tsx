"use client";

import { startTransition, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserCourseState } from "@/lib/types";

const actions: Array<{ label: string; value: UserCourseState }> = [
  { label: "Save", value: "bookmarked" },
  { label: "Enrolled", value: "enrolled_external" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export function CourseStatusActions({
  courseId,
  currentStatus,
}: {
  courseId: string;
  currentStatus?: UserCourseState;
}) {
  const [status, setStatus] = useState<UserCourseState | undefined>(currentStatus);
  const [pending, setPending] = useState(false);

  async function updateStatus(nextStatus: UserCourseState) {
    setPending(true);

    try {
      const response = await fetch(`/api/me/course-status/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
          percentComplete: nextStatus === "completed" ? 100 : nextStatus === "bookmarked" ? 0 : 25,
        }),
      });

      if (response.ok) {
        setStatus(nextStatus);
      }
    } finally {
      startTransition(() => setPending(false));
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.value}
          variant={status === action.value ? "primary" : "outline"}
          size="sm"
          onClick={() => updateStatus(action.value)}
          disabled={pending}
        >
          {pending && status !== action.value ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {action.label}
        </Button>
      ))}
    </div>
  );
}
