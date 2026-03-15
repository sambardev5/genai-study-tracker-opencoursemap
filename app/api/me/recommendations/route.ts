import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(repository.getRecommendations(user.id));
}
