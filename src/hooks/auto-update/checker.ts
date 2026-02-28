import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { 
  INSTALLED_PACKAGE_JSON, 
  NPM_FETCH_TIMEOUT, 
  NPM_REGISTRY_URL, 
  PACKAGE_NAME, 
  USER_OPENCODE_CONFIG, 
  USER_OPENCODE_CONFIG_JSONC 
} from './constants';

export interface PackageJson {
  name?: string;
  version?: string;
  [key: string]: unknown;
}

export interface NpmDistTags {
  latest: string;
  [key: string]: string;
}

/**
 * Strips single and multi-line comments from a JSON string.
 */
function stripJsonComments(text: string): string {
  return text.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");
}

/**
 * Resolves the installed version from node_modules, with memoization.
 */
let cachedPackageVersion: string | null = null;
export function getCachedVersion(): string | null {
  if (cachedPackageVersion) return cachedPackageVersion;

  try {
    if (fs.existsSync(INSTALLED_PACKAGE_JSON)) {
      const content = fs.readFileSync(INSTALLED_PACKAGE_JSON, 'utf-8');
      const pkg = JSON.parse(content) as PackageJson;
      if (pkg.version) {
        cachedPackageVersion = pkg.version;
        return pkg.version;
      }
    }
  } catch {
    /* empty */
  }

  try {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const pkgPath = findPackageJsonUp(currentDir);
    if (pkgPath) {
      const content = fs.readFileSync(pkgPath, 'utf-8');
      const pkg = JSON.parse(content) as PackageJson;
      if (pkg.version) {
        cachedPackageVersion = pkg.version;
        return pkg.version;
      }
    }
  } catch (err) {
    console.warn('[auto-update] Failed to resolve version from current directory:', err);
  }

  return null;
}

/**
 * Recursively searches upwards for a package.json belonging to this plugin.
 */
function findPackageJsonUp(startPath: string): string | null {
  try {
    const stat = fs.statSync(startPath);
    let dir = stat.isDirectory() ? startPath : path.dirname(startPath);

    for (let i = 0; i < 10; i++) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        try {
          const content = fs.readFileSync(pkgPath, 'utf-8');
          const pkg = JSON.parse(content) as PackageJson;
          if (pkg.name === PACKAGE_NAME) return pkgPath;
        } catch {
          /* empty */
        }
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  } catch {
    /* empty */
  }
  return null;
}

/**
 * Fetches the latest version for a specific channel from the NPM registry.
 */
export async function getLatestVersion(channel: string = 'latest'): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), NPM_FETCH_TIMEOUT);

  try {
    const response = await fetch(NPM_REGISTRY_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as NpmDistTags;
    return data[channel] ?? data.latest ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Checks if the plugin is running in local development mode (e.g. from a file path).
 */
export function isLocalDevMode(directory: string): boolean {
  const configPaths = [
    path.join(directory, '.opencode', 'opencode.json'),
    path.join(directory, '.opencode', 'opencode.jsonc'),
    USER_OPENCODE_CONFIG,
    USER_OPENCODE_CONFIG_JSONC,
  ];

  for (const configPath of configPaths) {
    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        const json = JSON.parse(stripJsonComments(content));
        const plugins = json.plugin ?? [];
        if (plugins.some((p: string) => p.startsWith('/') || p.startsWith('file://'))) {
          return true;
        }
      }
    } catch {
      /* ignore */
    }
  }
  return false;
}
