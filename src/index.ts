import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { catalogTools } from "./tools/catalog";
import { createBuiltinMcps } from "./mcp";
import { loadPluginConfig } from "./config";

/**
 * opencoding-agent Plugin
 * 
 * Replaces default OpenCode agents with core-identical 'plan' and 'build' modes.
 * Now with dynamic MCP injection!
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  const pluginConfig = loadPluginConfig();
  const mcps = createBuiltinMcps(pluginConfig.disabled_mcps);
  const mcpNames = Object.keys(mcps);

  return {
    name: "opencoding-agent",

    // Config hook: Injected once during initialization
    config: async (opencodeConfig: any) => {
      // 1. Inject specialized agents (opencoding-plan, opencoding-build)
      await injectAgents(opencodeConfig);

      // 2. Merge MCP configs
      if (!opencodeConfig.mcp) {
        opencodeConfig.mcp = { ...mcps };
      } else {
        Object.assign(opencodeConfig.mcp, mcps);
      }

      // 3. Grant full permissions to opencoding- agents for these MCPs
      const agentsToGrant = ["opencoding-plan", "opencoding-build"];
      agentsToGrant.forEach((agentName) => {
        const agent = opencodeConfig.agent[agentName];
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

    // Register custom tools
    tool: {
      ...catalogTools,
    },

    // Register MCPs
    mcp: mcps,
  };
};

export default OpencodingAgentPlugin;
