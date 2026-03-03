import { expect, test, describe, mock } from "bun:test";
import { listTool } from "../../../src/tools/catalog/list";

describe("Catalog List Tool", () => {
  test("should return formatted list of categories", async () => {
    // Mock global fetch
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { name: "Agent1", category: "Test", description: "Desc1" },
          { name: "Agent2", category: "Test", description: "Desc2" },
          { name: "Agent3", category: "Dev", description: "Desc3" }
        ]),
      })
    ) as any;

    const result = await (listTool as any).execute({});
    expect(result).toContain("Available Subagent Categories:");
    expect(result).toContain("Test: 2 agents");
    expect(result).toContain("Dev: 1 agents");
  });

  test("should handle fetch failure gracefully", async () => {
    global.fetch = mock(() =>
      Promise.resolve({ ok: false, status: 404, statusText: "Not Found" })
    ) as any;

    const result = await (listTool as any).execute({});
    expect(result).toContain("Fetch failed");
  });
});
