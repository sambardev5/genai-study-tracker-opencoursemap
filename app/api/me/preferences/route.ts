import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";
import { preferenceUpdateSchema } from "@/lib/validators/api";

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  const parsed = preferenceUpdateSchema.parse(await request.json());
  const preferences = repository.updatePreferences(user.id, parsed);

  return NextResponse.json(preferences);
}
