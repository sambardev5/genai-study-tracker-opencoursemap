import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(repository.getLearningPaths());
}
