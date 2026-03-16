import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

const studySourceConfigs = [
  {
    path: join(repoRoot, "study.md"),
    sourceFile: "study.md",
    mapCells(cells) {
      const [indexCell, provider, course, url, credential] = cells;
      return { indexCell, provider, course, url, credential };
    },
  },
  {
    path: join(repoRoot, "study_150_courses.md"),
    sourceFile: "study_150_courses.md",
    mapCells(cells) {
      const [indexCell, course, provider, url, credential] = cells;
      return { indexCell, provider, course, url, credential };
    },
  },
];

const entries = [];

for (const config of studySourceConfigs) {
  const content = readFileSync(config.path, "utf8");

  for (const line of content.split(/\r?\n/)) {
    if (!line.startsWith("|")) {
      continue;
    }

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length !== 5 || cells[0] === "#") {
      continue;
    }

    const mapped = config.mapCells(cells);
    const index = Number.parseInt(mapped.indexCell, 10);

    if (Number.isNaN(index)) {
      continue;
    }

    entries.push([
      index,
      mapped.provider,
      mapped.course,
      mapped.url,
      mapped.credential,
      config.sourceFile,
    ]);
  }
}

const json = `${JSON.stringify(entries, null, 2)}\n`;

if (process.argv.includes("--write")) {
  writeFileSync(join(repoRoot, "data", "study-catalog-entries.json"), json);
} else {
  process.stdout.write(json);
}
