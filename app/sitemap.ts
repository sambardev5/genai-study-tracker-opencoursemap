import type { MetadataRoute } from "next";
import { repository } from "@/lib/db/repository";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return [
    "",
    "/courses",
    "/paths",
    "/about",
    ...repository.getTopics().map((topic) => `/topics/${topic.slug}`),
    ...repository.listCourses({ page: 1, pageSize: 100, sort: "relevance" }).items.map((course) => `/courses/${course.id}`),
    ...repository.getLearningPaths().map((path) => `/paths/${path.slug}`),
  ].map((pathname) => ({
    url: `${baseUrl}${pathname}`,
    lastModified: new Date(),
  }));
}
