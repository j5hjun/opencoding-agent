import { expect, test, describe } from "bun:test";
import OpencodingAgentPlugin from "../src/index";

describe("Plugin Entry Point", () => {
  test("should initialize plugin and return config/tool/hooks", async () => {
    const mockCtx = {
      client: { tui: { showToast: async () => {} } },
      directory: process.cwd()
    };

    const plugin = await OpencodingAgentPlugin(mockCtx as any);

    expect(plugin.config).toBeDefined();
    expect(plugin.tool).toBeDefined();
    expect(plugin['experimental.chat.system.transform']).toBeDefined();
    expect(plugin['tool.execute.before']).toBeDefined();
    expect(plugin['tool.execute.after']).toBeDefined();
  });
});
