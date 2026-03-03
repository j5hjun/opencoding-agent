import { expect, test, describe } from "bun:test";
import { getHooks } from "../../src/hooks/index";

describe("Hooks Gateway (src/hooks/index.ts)", () => {
  test("should aggregate all hook sets", async () => {
    const mockCtx = { directory: process.cwd() };
    const hooks = await getHooks(mockCtx);

    expect(hooks.superpowersHooks).toBeDefined();
    expect(hooks.catalogHooks).toBeDefined();
  });
});
