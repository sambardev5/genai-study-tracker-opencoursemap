import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";
import { preferenceUpdateSchema } from "@/lib/validators/api";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = preferenceUpdateSchema.parse(await request.json());
  const preferences = repository.updatePreferences(user.id, parsed);

  return NextResponse.json(preferences);
}
