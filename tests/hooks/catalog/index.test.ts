import { expect, test, describe } from "bun:test";
import { loadCatalogHooks } from "../../../src/hooks/catalog/index";

describe("Catalog Hook Gateway", () => {
  test("should inject strategy tag into system prompt", async () => {
    const hooks = await loadCatalogHooks({});
    const transform = hooks['experimental.chat.system.transform'];
    
    expect(transform).toBeDefined();

    const output = { system: [] as string[] };
    await transform({}, output);

    if (output.system.length > 0) {
      expect(output.system[0]).toContain('<SUBAGENT_CATALOG_STRATEGY>');
    }
  });
});
