import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";
import { profileUpdateSchema } from "@/lib/validators/api";

export async function GET() {
  const user = await getCurrentUser();

  return NextResponse.json({
    profile: repository.getProfile(user.id),
    preferences: repository.getPreferences(user.id),
  });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  const parsed = profileUpdateSchema.parse(await request.json());
  const profile = repository.updateProfile(user.id, parsed);

  return NextResponse.json(profile);
}
