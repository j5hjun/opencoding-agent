import { expect, test, describe } from "bun:test";
import { getSuperpowersHooks } from "../../src/hooks/superpowers";

describe("superpowers hook", () => {
  test("should inject bootstrap content into system prompt", async () => {
    const ctx = {};
    const hooks = await getSuperpowersHooks(ctx);
    const output = { system: [] as string[] };
    
    await hooks['experimental.chat.system.transform']({}, output);
    
    expect(output.system.length).toBeGreaterThan(0);
    expect(output.system[0]).toContain("You have superpowers");
    expect(output.system[0]).toContain("Tool Mapping for OpenCode");
  });
});
