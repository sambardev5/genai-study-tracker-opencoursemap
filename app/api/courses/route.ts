import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { parseCourseSearchParams } from "@/lib/search/params";

export async function GET(request: NextRequest) {
  const filters = parseCourseSearchParams(request.nextUrl.searchParams);
  return NextResponse.json(repository.listCourses(filters));
}
