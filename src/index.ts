import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { catalogTools } from "./tools/catalog";

/**
 * opencoding-agent Plugin
 * 
 * Replaces default OpenCode agents with core-identical 'plan' and 'build' modes.
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  return {
    // Config hook: Injected once during initialization
    config: async (config) => {
      await injectAgents(config);
    },
    // Register custom tools
    tool: {
      ...catalogTools
    }
  };
};

export default OpencodingAgentPlugin;
