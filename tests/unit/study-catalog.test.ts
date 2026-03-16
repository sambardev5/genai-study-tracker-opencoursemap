import microsoftLearnAiEngineerEntriesJson from "@/data/microsoft-learn-ai-engineer-entries.json";
import studyCatalogEntriesJson from "@/data/study-catalog-entries.json";
import { describe, expect, it } from "vitest";
import { getCatalogCourses, getCatalogProviders } from "@/lib/db/demo-data";
import { studyCourses, studyLearningPaths, studyProviders } from "@/lib/db/study-catalog";

describe("study catalog import", () => {
  it("imports the study guides plus the Microsoft Learn AI engineer catalog", () => {
    const baseStudyCount = (studyCatalogEntriesJson as Array<[number, string]>).filter(
      (entry) => entry[1] !== "Microsoft Learn" && entry[1] !== "NVIDIA DLI",
    ).length;

    expect(studyCourses).toHaveLength(
      baseStudyCount + (microsoftLearnAiEngineerEntriesJson as Array<unknown>).length,
    );
  });

  it("includes key providers from the study guide", () => {
    const providerIds = new Set(studyProviders.map((provider) => provider.id));

    expect(providerIds.has("provider-google")).toBe(true);
    expect(providerIds.has("provider-microsoft")).toBe(true);
    expect(providerIds.has("provider-kaggle")).toBe(true);
    expect(providerIds.has("provider-ibm")).toBe(true);
    expect(providerIds.has("provider-edx")).toBe(true);
  });

  it("groups imported courses into published topic-based learning paths", () => {
    expect(studyLearningPaths.length).toBeGreaterThanOrEqual(6);
    expect(studyLearningPaths.every((path) => path.items.length >= 3)).toBe(true);
  });

  it("infers topic groupings for representative courses", () => {
    const promptCourse = studyCourses.find((course) => course.title === "ChatGPT Prompt Engineering for Developers");
    const mcpCourse = studyCourses.find((course) => course.title === "Model Context Protocol (MCP) Course");
    const llmCourse = studyCourses.find((course) => course.title === "LLM Course");

    expect(promptCourse?.topicIds).toEqual(expect.arrayContaining(["topic-prompt", "topic-genai"]));
    expect(mcpCourse?.topicIds).toEqual(expect.arrayContaining(["topic-mcp", "topic-agents"]));
    expect(llmCourse?.topicIds).toEqual(expect.arrayContaining(["topic-llm", "topic-genai"]));
  });

  it("preserves repeated study URLs as separate course rows when the files list them separately", () => {
    const crashCourseRows = studyCourses.filter(
      (course) => course.canonicalUrl === "https://developers.google.com/machine-learning/crash-course",
    );

    expect(crashCourseRows).toHaveLength(16);
    expect(crashCourseRows.some((course) => course.title === "Machine Learning Crash Course")).toBe(true);
    expect(crashCourseRows.every((course) => course.title === "Machine Learning Crash Course")).toBe(true);
  });

  it("normalizes IBM SkillsBuild links to the working AI catalog URL", () => {
    const ibmCourses = studyCourses.filter((course) => course.providerId === "provider-ibm");

    expect(ibmCourses.length).toBeGreaterThan(0);
    expect(
      ibmCourses.every(
        (course) =>
          course.canonicalUrl === "https://skillsbuild.org/students/course-catalog/artificial-intelligence" &&
          course.enrollmentUrl === "https://skillsbuild.org/students/course-catalog/artificial-intelligence",
      ),
    ).toBe(true);
  });

  it("replaces legacy Microsoft browse placeholders with concrete Microsoft Learn course pages", () => {
    const microsoftCourses = studyCourses.filter((course) => course.providerId === "provider-microsoft");

    expect(microsoftCourses).toHaveLength(
      (microsoftLearnAiEngineerEntriesJson as Array<unknown>).length,
    );
    expect(
      microsoftCourses.every((course) =>
        /^https:\/\/learn\.microsoft\.com\/en-us\/training\/(modules|paths)\//.test(course.canonicalUrl),
      ),
    ).toBe(true);
    expect(
      microsoftCourses.some(
        (course) =>
          course.title === "Develop generative AI apps in Azure" &&
          course.canonicalUrl ===
            "https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/",
      ),
    ).toBe(true);
  });

  it("rescans study_150 placeholder rows onto real catalog pages and removes numeric suffixes", () => {
    expect(studyCourses.some((course) => course.title === "Generative AI Foundations 4")).toBe(false);
    expect(studyCourses.some((course) => course.title === "Prompt Engineering 5")).toBe(false);
    expect(studyCourses.some((course) => course.title === "Transformers and LLMs 8")).toBe(false);
    expect(studyCourses.some((course) => course.title === "Responsible AI 10")).toBe(false);
    expect(
      studyCourses.some(
        (course) =>
          course.title === "Open-Source AI Cookbook" &&
          course.canonicalUrl === "https://huggingface.co/learn/cookbook",
      ),
    ).toBe(true);
    expect(
      studyCourses.some(
        (course) =>
          course.title === "ML for 3D Course" &&
          course.canonicalUrl === "https://huggingface.co/learn/ml-for-3d-course",
      ),
    ).toBe(true);
    expect(
      studyCourses.some(
        (course) =>
          course.providerId === "provider-hf" && course.canonicalUrl === "https://huggingface.co/learn",
      ),
    ).toBe(false);
    expect(
      studyCourses.some(
        (course) =>
          course.title === "Courses - DeepLearning.AI" &&
          course.canonicalUrl === "https://www.deeplearning.ai/courses/",
      ),
    ).toBe(true);
    expect(
      studyCourses.some(
        (course) =>
          course.title === "Machine Learning Online Courses | Coursera" &&
          course.canonicalUrl === "https://www.coursera.org/browse/data-science/machine-learning",
      ),
    ).toBe(true);
    expect(
      studyCourses.some(
        (course) =>
          course.title === "Online AI courses and programs | edX" &&
          course.canonicalUrl === "https://www.edx.org/learn/artificial-intelligence",
      ),
    ).toBe(true);
    expect(studyCourses.some((course) => course.providerId === "provider-nvidia-dli")).toBe(false);
  });

  it("removes Tesla from the merged catalog providers and courses", () => {
    const providerIds = new Set(getCatalogProviders().map((provider) => provider.id));
    const courseIds = new Set(getCatalogCourses().map((course) => course.id));

    expect(providerIds.has("provider-tesla")).toBe(false);
    expect(courseIds.has("course-tesla-ai-robotics")).toBe(false);
  });
});
