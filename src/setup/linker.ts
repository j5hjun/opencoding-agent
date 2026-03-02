import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Ensures symlinks exist for bundled superpowers resources.
 * This connects bundled src/superpowers to ~/.config/opencode.
 */
export const setupSuperpowersLink = async (ctx: any) => {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.config/opencode');
  const targetSkills = path.join(configDir, 'skills/superpowers');
  const targetPlugin = path.join(configDir, 'plugins/superpowers.js');

  // Calculate absolute paths to bundled source
  // __dirname is dist/src/setup/ when running from dist
  // We want to reach [root]/src/superpowers/
  const pluginRoot = path.resolve(__dirname, '../../../');
  const sourceSkills = path.join(pluginRoot, 'src/superpowers/skills');
  const sourcePlugin = path.join(pluginRoot, 'src/superpowers/.opencode/plugins/superpowers.js');

  const ensureLink = (source: string, target: string, type: 'dir' | 'file') => {
    if (!fs.existsSync(source)) {
      console.warn(`[opencoding-agent] Source not found: ${source}`);
      return;
    }

    if (fs.existsSync(target)) {
      // Check if it's already a link pointing to the right place
      try {
        const stats = fs.lstatSync(target);
        if (stats.isSymbolicLink()) {
          const currentLink = fs.readlinkSync(target);
          if (path.resolve(currentLink) === path.resolve(source)) {
            return; // Already correctly linked
          }
        }
      } catch (e) {
        // Fall through to recreation
      }
      
      // If it exists but is wrong/broken, remove it
      console.log(`[opencoding-agent] Updating link: ${target}`);
      fs.rmSync(target, { recursive: true, force: true });
    }

    // Create parent directory if needed
    fs.mkdirSync(path.dirname(target), { recursive: true });

    // Create the link
    try {
      fs.symlinkSync(source, target, type);
      console.log(`[opencoding-agent] Created link: ${target} -> ${source}`);
    } catch (err) {
      console.error(`[opencoding-agent] Failed to create link ${target}:`, err);
    }
  };

  ensureLink(sourceSkills, targetSkills, 'dir');
  ensureLink(sourcePlugin, targetPlugin, 'file');
};
