import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";

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
    }
  };
};

export default OpencodingAgentPlugin;
