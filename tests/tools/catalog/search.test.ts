import { expect, test, describe, mock } from "bun:test";
import { searchTool } from "../../../src/tools/catalog/search";

describe("Catalog Search Tool", () => {
  test("should filter agents by query", async () => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { name: "Frontend Expert", category: "UI", description: "React master" },
          { name: "Backend Expert", category: "API", description: "Node master" }
        ]),
      })
    ) as any;

    const result = await (searchTool as any).execute({ query: "React" });
    expect(result).toContain("Frontend Expert");
    expect(result).not.toContain("Backend Expert");
  });

  test("should return message when no agents match", async () => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as any;

    const result = await (searchTool as any).execute({ query: "Unknown" });
    expect(result).toContain('No agents found matching "Unknown"');
  });
});
