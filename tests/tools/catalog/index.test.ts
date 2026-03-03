import { expect, test, describe } from "bun:test";
import { catalogTools } from "../../../src/tools/catalog/index";

describe("Catalog Tool Gateway (src/tools/catalog/index.ts)", () => {
  test("should export catalog tool set", () => {
    expect(catalogTools["subagent-catalog:list"]).toBeDefined();
    expect(catalogTools["subagent-catalog:search"]).toBeDefined();
    expect(catalogTools["subagent-catalog:fetch"]).toBeDefined();
  });
});
