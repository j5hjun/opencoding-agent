import path from 'path';
import { getPluginRoot } from '../utils/paths';
import { logger } from '../utils/logger';

/**
 * Loads the original SuperpowersPlugin logic from bundled source.
 * This ensures the exact same logic runs as the original.
 */
export const loadSuperpowersHooks = async (ctx: any) => {
  const pluginRoot = getPluginRoot();
  const pluginPath = path.join(pluginRoot, 'src/superpowers/.opencode/plugins/superpowers.js');
  
  try {
    const { SuperpowersPlugin } = await import(pluginPath);
    return await SuperpowersPlugin(ctx);
  } catch (err) {
    logger.error('Failed to load original superpowers plugin:', err);
    return {};
  }
};
