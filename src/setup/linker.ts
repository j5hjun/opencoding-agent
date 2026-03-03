import path from 'path';
import { getPluginRoot, getConfigDir } from '../utils/paths';
import { ensureSymlink } from '../utils/linker';

/**
 * Ensures symlinks exist for bundled superpowers resources.
 * This connects bundled src/superpowers to ~/.config/opencode.
 */
export const setupSuperpowersLink = async (_ctx: any) => {
  const configDir = getConfigDir();
  const targetSkills = path.join(configDir, 'skills');

  const pluginRoot = getPluginRoot();
  const sourceSkills = path.join(pluginRoot, 'src/skills');

  ensureSymlink(sourceSkills, targetSkills, 'dir');
};
