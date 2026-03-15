import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() =>
  new Response(
    JSON.stringify({
      status: "accepted",
      message: "Placeholder resource verification job. Implement URL reachability and price checks here.",
    }),
    { headers: { "Content-Type": "application/json" }, status: 202 },
  ),
);
