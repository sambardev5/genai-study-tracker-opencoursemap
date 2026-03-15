import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() =>
  new Response(
    JSON.stringify({
      status: "accepted",
      message: "Placeholder recompute job. Populate user_topic_progress and user_skill_gaps here.",
    }),
    { headers: { "Content-Type": "application/json" }, status: 202 },
  ),
);
