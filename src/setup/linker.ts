import path from 'path';
import { getPluginRoot, getConfigDir } from '../utils/paths';
import { ensureSymlink } from '../utils/linker';

/**
 * Ensures symlinks exist for bundled superpowers resources.
 * This connects bundled src/superpowers to ~/.config/opencode.
 */
export const setupSuperpowersLink = async (ctx: any) => {
  const configDir = getConfigDir();
  const targetSkills = path.join(configDir, 'skills/superpowers');
  const targetPlugin = path.join(configDir, 'plugins/superpowers.js');

  const pluginRoot = getPluginRoot();
  const sourceSkills = path.join(pluginRoot, 'src/superpowers/skills');
  const sourcePlugin = path.join(pluginRoot, 'src/superpowers/.opencode/plugins/superpowers.js');

  ensureSymlink(sourceSkills, targetSkills, 'dir');
  ensureSymlink(sourcePlugin, targetPlugin, 'file');
};
