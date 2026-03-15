import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { repository } from "@/lib/db/repository";

export async function POST() {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(repository.runIngestion(), { status: 202 });
}
