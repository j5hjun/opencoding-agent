
import type { Plugin, Hooks } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { createCatalogTools } from "./tools/catalog";
import { createBuiltinMcps } from "./mcp";
import { loadPluginConfig } from "./config";
import { createAutoUpdateHook } from "./hooks/auto-update";

const OpencodingAgentPlugin: Plugin = async (ctx) => {
  const pluginConfig = loadPluginConfig(ctx.directory);
  const mcps = createBuiltinMcps(pluginConfig.disabled_mcps);
  const mcpNames = Object.keys(mcps);

  const autoUpdateHook = createAutoUpdateHook(ctx);

  const hooks: Hooks = {
    name: "opencoding-agent",

    config: async (opencodeConfig) => {

      await injectAgents(opencodeConfig as any);

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

      const agentsToGrant = ["opencoding-plan", "opencoding-build"];
      const agentConfig = opencodeConfig.agent as Record<string, any>;

      agentsToGrant.forEach((agentName) => {
        const agent = agentConfig[agentName];
        if (!agent) return;

        if (!agent.permission) {
          agent.permission = {};
        }

        for (const mcpName of mcpNames) {

          const sanitizedMcpName = mcpName.replace(/[^a-zA-Z0-9_-]/g, "_");
          const permissionKey = `${sanitizedMcpName}_*`;

          if (!(permissionKey in agent.permission)) {
            agent.permission[permissionKey] = "allow";
          }
        }
      });
    },

    event: async ({ event }) => {
      if (event.type === "session.created") {
        await autoUpdateHook();
      }
    },

    tool: {
      ...createCatalogTools(ctx.client),
    },

    mcp: mcps,
  } as Hooks & { name: string; mcp: any };

  return hooks;
};

export default OpencodingAgentPlugin;
