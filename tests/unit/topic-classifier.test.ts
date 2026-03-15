import { describe, expect, it } from "vitest";
import { classifyTopics } from "@/lib/ingestion/classifiers/topic-classifier";

describe("topic classifier", () => {
  it("maps RAG and MCP keywords to known topics", () => {
    const matches = classifyTopics("Build retrieval augmented generation apps with MCP tool support.");

    expect(matches).toContain("rag");
    expect(matches).toContain("mcp");
  });
});
