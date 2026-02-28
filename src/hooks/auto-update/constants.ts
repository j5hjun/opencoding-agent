import * as os from 'node:os';
import * as path from 'node:path';

export const PACKAGE_NAME = 'opencoding-agent';
export const NPM_REGISTRY_URL = `https://registry.npmjs.org/-/package/${PACKAGE_NAME}/dist-tags`;
export const NPM_FETCH_TIMEOUT = 3000;

function getCacheDir(): string {
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA ?? os.homedir(), 'opencode');
  }
  return path.join(os.homedir(), '.cache', 'opencode');
}

/** The directory used by OpenCode to cache node_modules for plugins. */
export const CACHE_DIR = getCacheDir();

/** Path to this plugin's package.json within the OpenCode cache. */
export const INSTALLED_PACKAGE_JSON = path.join(
  CACHE_DIR,
  'node_modules',
  PACKAGE_NAME,
  'package.json',
);

function getConfigDir(): string {
  const userConfigDir = process.env.XDG_CONFIG_HOME
    ? process.env.XDG_CONFIG_HOME
    : path.join(os.homedir(), '.config');

  return path.join(userConfigDir, 'opencode');
}

export const USER_OPENCODE_CONFIG = path.join(getConfigDir(), 'opencode.json');
export const USER_OPENCODE_CONFIG_JSONC = path.join(getConfigDir(), 'opencode.jsonc');
