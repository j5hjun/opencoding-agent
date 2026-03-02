import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { catalogTools } from "./tools/catalog/index";
import { setupSuperpowersLink } from "./setup/linker";
import { loadSuperpowersHooks } from "./hooks/superpowers-loader";
import { loadCatalogHooks } from "./hooks/catalog-prompt";
import { logger } from "./utils/logger";

/**
 * opencoding-agent Plugin
 * 
 * Replaces default OpenCode agents with core-identical 'plan' and 'build' modes.
 * Now bundles and auto-configures Superpowers!
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  logger.info('Plugin initializing...');
  // Setup: Auto-link superpowers resources to global config
  await setupSuperpowersLink(ctx);

  // Load original superpowers hooks
  const superpowersHooks = await loadSuperpowersHooks(ctx);
  // Load catalog guidance hooks
  const catalogHooks = await loadCatalogHooks(ctx);

  return {
    // Config hook: Injected once during initialization
    config: async (config) => {
      await injectAgents(config);
    },
    // Register custom tools
    tool: {
      ...catalogTools
    },
    // Merge superpowers hooks (like system.transform)
    ...superpowersHooks,
    ...catalogHooks
  };
};

export default OpencodingAgentPlugin;
