import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (request) => {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${Deno.env.get("CRON_SECRET") ?? ""}`;

  if (!authHeader || authHeader !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  return new Response(
    JSON.stringify({
      status: "accepted",
      message: "Placeholder ingestion run triggered. Wire adapters and database writes here.",
    }),
    { headers: { "Content-Type": "application/json" }, status: 202 },
  );
});
