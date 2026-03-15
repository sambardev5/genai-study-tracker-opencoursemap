import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = repository.getLearningPathBySlug(slug);

  if (!path) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(path);
}
