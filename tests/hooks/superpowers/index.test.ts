import { expect, test, describe } from "bun:test";
import { getSuperpowersHooks } from "../../../src/hooks/superpowers/index";

describe("Superpowers Gateway (src/hooks/superpowers/index.ts)", () => {
  test("should merge reference port and active guardrails", async () => {
    const mockCtx = { directory: process.cwd() };
    const hooks = await getSuperpowersHooks(mockCtx);

    // Bootstrap (from superpowers.ts)
    expect(hooks['experimental.chat.system.transform']).toBeDefined();
    // Guardrails (from guardrails/ folder)
    expect(hooks['tool.execute.before']).toBeDefined();
    expect(hooks['tool.execute.after']).toBeDefined();
  });
});
