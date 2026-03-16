import { describe, expect, it } from "vitest";
import { getNvidiaCatalogData } from "@/lib/db/nvidia-catalog";

describe("nvidia catalog import", () => {
  it("imports the official NVIDIA AI training search results", () => {
    const data = getNvidiaCatalogData();

    expect(data.providers).toHaveLength(1);
    expect(data.providers[0]?.id).toBe("provider-nvidia-dli");
    expect(data.courses).toHaveLength(93);
  });

  it("preserves NVIDIA pricing states for free, paid, and price-not-stated courses", () => {
    const { courses } = getNvidiaCatalogData();

    const freeCourses = courses.filter((course) => course.isFree);
    const paidCourses = courses.filter(
      (course) => !course.isFree && course.freeVerificationStatus === "verified",
    );
    const otherCourses = courses.filter(
      (course) => !course.isFree && course.freeVerificationStatus === "unknown",
    );

    expect(freeCourses).toHaveLength(21);
    expect(paidCourses).toHaveLength(29);
    expect(otherCourses).toHaveLength(43);
  });

  it("maps NVIDIA entries onto concrete DLI course-detail URLs", () => {
    const { courses } = getNvidiaCatalogData();

    expect(
      courses.every((course) =>
        /^https:\/\/learn\.nvidia\.com\/courses\/course-detail\?course_id=course-v1:DLI\+/.test(course.canonicalUrl),
      ),
    ).toBe(true);
  });

  it("infers representative NVIDIA topic groupings from titles and metadata", () => {
    const { courses } = getNvidiaCatalogData();

    const transformerCourse = courses.find(
      (course) => course.title === "Building Transformer-Based Natural Language Processing Applications",
    );
    const ragCourse = courses.find((course) => course.title === "Building RAG Agents with LLMs");
    const jetsonCourse = courses.find((course) => course.title === "Getting Started with AI on Jetson Nano");
    const openUsdCourse = courses.find((course) => course.title === "Learn OpenUSD: Foundations to Applied Concepts");

    expect(transformerCourse?.topicIds).toEqual(expect.arrayContaining(["topic-llm", "topic-genai"]));
    expect(ragCourse?.topicIds).toEqual(expect.arrayContaining(["topic-rag", "topic-agents"]));
    expect(jetsonCourse?.topicIds).toEqual(expect.arrayContaining(["topic-robotics", "topic-cv"]));
    expect(openUsdCourse?.topicIds).toEqual(expect.arrayContaining(["topic-simulation"]));
  });
});
