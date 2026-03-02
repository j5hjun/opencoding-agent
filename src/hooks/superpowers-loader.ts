import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Loads the original SuperpowersPlugin logic from bundled source.
 * This ensures the exact same logic runs as the original.
 */
export const loadSuperpowersHooks = async (ctx: any) => {
  const pluginRoot = path.resolve(__dirname, '../../../');
  const pluginPath = path.join(pluginRoot, 'src/superpowers/.opencode/plugins/superpowers.js');
  
  try {
    const { SuperpowersPlugin } = await import(pluginPath);
    return await SuperpowersPlugin(ctx);
  } catch (err) {
    console.error('[opencoding-agent] Failed to load original superpowers plugin:', err);
    return {};
  }
};
