import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getPluginRoot = () => {
  // If running from dist/src/utils/, root is ../../../
  // If running from src/utils/, root is ../../
  const isDist = __dirname.includes('dist');
  return path.resolve(__dirname, isDist ? '../../../' : '../../');
};

export const getHomeDir = () => os.homedir();

export const getConfigDir = () => {
  const envConfigDir = process.env.OPENCODE_CONFIG_DIR;
  if (envConfigDir) return path.resolve(envConfigDir.startsWith('~') ? envConfigDir.replace('~', getHomeDir()) : envConfigDir);
  return path.join(getHomeDir(), '.config/opencode');
};
