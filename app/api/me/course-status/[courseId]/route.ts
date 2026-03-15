import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { repository } from "@/lib/db/repository";
import { courseStatusSchema } from "@/lib/validators/api";

export async function PUT(request: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  const { courseId } = await params;
  const parsed = courseStatusSchema.parse(await request.json());
  const status = repository.upsertUserCourseStatus(user.id, courseId, parsed);

  return NextResponse.json(status);
}
