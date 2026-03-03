import { expect, test, describe } from "bun:test";
import { allTools } from "../../src/tools/index";

describe("Tools Gateway (src/tools/index.ts)", () => {
  test("should aggregate all tools", () => {
    expect(allTools["subagent-catalog:list"]).toBeDefined();
    expect(allTools["subagent-catalog:search"]).toBeDefined();
    expect(allTools["subagent-catalog:fetch"]).toBeDefined();
  });
});
