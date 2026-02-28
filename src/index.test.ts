import { describe, expect, test, mock, beforeEach } from "bun:test";
import * as configMod from "./config";
import OpencodingAgentPlugin from "./index";

mock.module("./config", () => {
  return {
    loadPluginConfig: () => ({ disabled_mcps: [] }),
    PLUGIN_NAME: "opencoding-agent"
  };
});

describe("OpencodingAgentPlugin", () => {
  const mockCtx: any = {
    directory: "/mock/dir"
  };

  test("config hook injects agents and mcps and permissions", async () => {
    const plugin = await OpencodingAgentPlugin(mockCtx);
    const opencodeConfig: any = {
      agent: {},
      mcp: {}
    };

    if (plugin.config) {
      await plugin.config(opencodeConfig);
    }

    expect(opencodeConfig.agent["opencoding-plan"]).toBeDefined();
    expect(opencodeConfig.agent["opencoding-build"]).toBeDefined();

    expect(opencodeConfig.mcp["websearch"]).toBeDefined();
    expect(opencodeConfig.mcp["context7"]).toBeDefined();
    expect(opencodeConfig.mcp["grep_app"]).toBeDefined();

    expect(opencodeConfig.agent["opencoding-plan"].permission["websearch_*"]).toBe("allow");
    expect(opencodeConfig.agent["opencoding-build"].permission["websearch_*"]).toBe("allow");
  });
});
