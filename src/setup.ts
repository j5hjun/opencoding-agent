import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { logger } from './utils/index';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Path Helpers utilizing SDK directory if provided
 */
export const getPluginRoot = () => {
  const isDist = __dirname.includes('dist');
  return path.resolve(__dirname, isDist ? '../../' : '../');
};

export const getConfigDir = () => {
  const envConfigDir = process.env.OPENCODE_CONFIG_DIR;
  if (envConfigDir) {
    const homeDir = os.homedir();
    return path.resolve(envConfigDir.startsWith('~') ? envConfigDir.replace('~', homeDir) : envConfigDir);
  }
  return path.join(os.homedir(), '.config/opencode');
};

/**
 * Setup Environment: Symlink resources
 */
export const setupEnvironment = async (directory: string) => {
  const source = path.join(getPluginRoot(), 'src/skills');
  const target = path.join(getConfigDir(), 'skills');

  if (!fs.existsSync(source)) {
    logger.warn(`Source skills not found at ${source}`);
    return;
  }

  if (fs.existsSync(target)) {
    try {
      if (fs.lstatSync(target).isSymbolicLink() && path.resolve(fs.readlinkSync(target)) === path.resolve(source)) return;
    } catch (e) {}
    fs.rmSync(target, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    fs.symlinkSync(source, target, 'dir');
    logger.success('Superpowers skills linked to OpenCode config.');
  } catch (err) {
    logger.error('Failed to link skills resources', err);
  }
};

/**
 * Hook Composition Logic
 */
export const mergeHooks = (h1: any, h2: any) => {
  const merged = { ...h1 };
  for (const [key, value] of Object.entries(h2)) {
    if (key === 'experimental.chat.system.transform' && merged[key]) {
      const existing = merged[key];
      const current = value as Function;
      merged[key] = async (i: any, o: any) => { 
        await existing(i, o); 
        await current(i, o); 
      };
    } else merged[key] = value;
  }
  return merged;
};
