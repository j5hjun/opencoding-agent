import type { Plugin } from "@opencode-ai/plugin";
import { injectAgents } from "./agents";
import { catalogTools } from "./tools/catalog/index";
import { setupSuperpowersLink } from "./setup/linker";
import { getSuperpowersHooks } from "./hooks/superpowers";
import { loadCatalogHooks } from "./hooks/catalog-prompt";
import { logger } from "./utils/logger";
import { mergePluginHooks } from "./utils/hooks";

/**
 * opencoding-agent Plugin
 * 
 * Replaces default OpenCode agents with core-identical 'plan' and 'build' modes.
 * Now bundles and auto-configures Superpowers!
 */
const OpencodingAgentPlugin: Plugin = async (ctx) => {
  // Initialize logger with client to enable TUI features (toasts)
  logger.setClient(ctx.client);

  logger.info('Plugin initializing...');
  // Setup: Auto-link superpowers resources to global config
  await setupSuperpowersLink(ctx);

  // Load superpowers hooks (TS)
  const superpowersHooks = await getSuperpowersHooks(ctx);
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
    // Chained hooks from multiple sources
    ...mergePluginHooks([superpowersHooks, catalogHooks])
  };
};

export default OpencodingAgentPlugin;
