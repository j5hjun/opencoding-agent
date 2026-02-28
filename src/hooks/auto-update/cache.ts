import * as fs from 'node:fs';
import * as path from 'node:path';
import { CACHE_DIR, PACKAGE_NAME } from './constants';

/**
 * Invalidates the current package by removing its directory from OpenCode's cache.
 * This forces a clean state so OpenCode re-downloads the plugin on next run.
 * @param packageName The name of the package to invalidate.
 */
export function invalidatePackage(packageName: string = PACKAGE_NAME): boolean {
  try {
    const pkgDir = path.join(CACHE_DIR, 'node_modules', packageName);

    if (fs.existsSync(pkgDir)) {
      fs.rmSync(pkgDir, { recursive: true, force: true });
      console.log(`[auto-update] Package cache removed: ${pkgDir}`);
      return true;
    }

    console.log(`[auto-update] Package not found in cache: ${packageName}`);
    return false;
  } catch (err) {
    console.error('[auto-update] Failed to invalidate package:', err);
    return false;
  }
}
