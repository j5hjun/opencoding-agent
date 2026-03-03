import { expect, test, describe, mock, afterAll } from "bun:test";
import { fetchTool } from "../../../src/tools/catalog/fetch";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

describe("Catalog Fetch Tool", () => {
  const testDir = path.join(os.tmpdir(), "fetch-test-" + Math.random().toString(36).slice(2));

  afterAll(() => {
    if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
  });

  test("should fetch and install agent content", async () => {
    global.fetch = mock(async (url: string) => {
      if (url.includes("catalog.json")) {
        return {
          ok: true,
          json: async () => [{ name: "TDD-Expert", path: "agents/tdd.md" }],
        };
      }
      return {
        ok: true,
        text: async () => "# TDD Expert Instructions",
      };
    }) as any;

    const result = await (fetchTool as any).execute(
      { name: "TDD-Expert", scope: "local" },
      { directory: testDir }
    );

    expect(result).toContain("Successfully installed");
    const expectedFile = path.join(testDir, ".opencode", "agents", "TDD-Expert.md");
    expect(fs.existsSync(expectedFile)).toBe(true);
    expect(fs.readFileSync(expectedFile, "utf8")).toBe("# TDD Expert Instructions");
  });
});
