import type { Course, SkillDefinition, SkillGapItem, UserCourseStatus } from "@/lib/types";

export function computeSkillGap(params: {
  skills: SkillDefinition[];
  courses: Course[];
  statuses: UserCourseStatus[];
}) {
  const completedCourseIds = new Set(
    params.statuses.filter((status) => status.status === "completed").map((status) => status.courseId),
  );

  return params.skills.map((skill) => {
    const matchingCourses = params.courses.filter((course) => course.skillIds.includes(skill.id));
    const completedCoverage = matchingCourses.filter((course) => completedCourseIds.has(course.id)).length;
    const coverageScore = Math.min(100, completedCoverage * 45);
    const recommendedCourseId = matchingCourses.find((course) => !completedCourseIds.has(course.id))?.id;

    return {
      skillId: skill.id,
      skillName: skill.name,
      coverageScore,
      gapScore: 100 - coverageScore,
      recommendedCourseId,
    } satisfies SkillGapItem;
  });
}
