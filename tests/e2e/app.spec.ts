import { expect, test } from "@playwright/test";

test("catalog and dashboard pages render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Discover the free AI courses")).toBeVisible();

  await page.goto("/courses");
  await expect(page.getByText("Free courses for modern AI practice")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByText("Progress, coverage, and gaps")).toBeVisible();
});
