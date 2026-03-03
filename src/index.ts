import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents/index";
import { allTools } from "./tools/index";
import { getHooks } from "./hooks/index";
import { logger } from "./utils/index";
import { setupEnvironment, mergeHooks } from "./setup";

/**
 * opencoding-agent Plugin Entry Point
 * 
 * Orchestrates environment setup and hook integration.
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  // 1. Foundation: Initialize Global Logger
  logger.setClient(ctx.client);
  
  // 2. Setup: Prepare symlinks and resources using SDK context
  await setupEnvironment(ctx.directory);

  // 3. Composition: Load and merge hooks from different modules
  const { superpowersHooks, catalogHooks } = await getHooks(ctx);

  return {
    config: async (config) => { 
      await injectAgents(config); 
    },
    tool: { ...allTools },
    ...mergeHooks(superpowersHooks, catalogHooks)
  };
};

export default OpencodingAgentPlugin;
