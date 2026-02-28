import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { catalogTools } from "./tools/catalog";
import { createBuiltinMcps } from "./mcp";
import { loadPluginConfig } from "./config";
import { createAutoUpdateHook } from "./hooks/auto-update";

/**
 * opencoding-agent Plugin
 * 
 * Replaces default OpenCode agents with core-identical 'plan' and 'build' modes.
 * Now with dynamic MCP injection!
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  const pluginConfig = loadPluginConfig(ctx.directory);
  const mcps = createBuiltinMcps(pluginConfig.disabled_mcps);
  const mcpNames = Object.keys(mcps);

  // Initialize auto-update hook
  const autoUpdateHook = createAutoUpdateHook(ctx);

  return {
    name: "opencoding-agent",

    // Config hook: Injected once during initialization
    // Note: 'any' is used because the Config type is not exported by the plugin SDK
    config: async (opencodeConfig: any) => {
      // 1. Inject specialized agents (opencoding-plan, opencoding-build)
      await injectAgents(opencodeConfig);

      // 2. Merge MCP configs (careful not to overwrite user settings)
      if (!opencodeConfig.mcp) {
        opencodeConfig.mcp = { ...mcps };
      } else {
        const existingMcp = opencodeConfig.mcp as Record<string, any>;
        for (const [name, config] of Object.entries(mcps)) {
          if (!(name in existingMcp)) {
            existingMcp[name] = config;
          }
        }
      }

      // 3. Grant full permissions to opencoding- agents for these MCPs
      const agentsToGrant = ["opencoding-plan", "opencoding-build"];
      const agentConfig = opencodeConfig.agent as Record<string, any>;

      agentsToGrant.forEach((agentName) => {
        const agent = agentConfig[agentName];
        if (!agent) return;

        if (!agent.permission) {
          agent.permission = {};
        }

        for (const mcpName of mcpNames) {
          // MCP tools are prefixed with sanitized mcp server name
          const sanitizedMcpName = mcpName.replace(/[^a-zA-Z0-9_-]/g, "_");
          const permissionKey = `${sanitizedMcpName}_*`;

          // Force allow unless already defined
          if (!(permissionKey in agent.permission)) {
            agent.permission[permissionKey] = "allow";
          }
        }
      });
    },

    // Session events
    event: async (input: any) => {
      await autoUpdateHook.event(input);
    },

    // Register custom tools
    tool: {
      ...catalogTools,
    },

    // Register MCPs
    mcp: mcps,
  };
};

export default OpencodingAgentPlugin;
