import type { PluginInput } from '@opencode-ai/plugin';
import { getCachedVersion, getLatestVersion, isLocalDevMode } from './checker';
import { invalidatePackage } from './cache';

/**
 * Creates an OpenCode hook that checks for plugin updates and invalidates cache if available.
 * 
 * @param ctx The plugin input context.
 * @returns A hook object for the session.created event.
 */
export function createAutoUpdateHook(ctx: PluginInput) {
  let hasChecked = false;

  return {
    event: ({ event }: { event: { type: string; properties?: unknown } }) => {
      // Only run once per process when a session is created
      if (event.type !== 'session.created') return;
      if (hasChecked) return;
      
      hasChecked = true;

      // Run check in the background
      setTimeout(async () => {
        // Skip check if in local development mode
        if (isLocalDevMode(ctx.directory)) {
          console.log('[auto-update] Local development mode detected. Skipping check.');
          return;
        }

        const currentVersion = getCachedVersion();
        const latestVersion = await getLatestVersion();

        if (!currentVersion || !latestVersion) {
          console.log('[auto-update] Could not determine versions. Skipping.');
          return;
        }

        if (currentVersion !== latestVersion) {
          console.log(`[auto-update] Update available: ${currentVersion} → ${latestVersion}`);
          
          // Show toast notification
          ctx.client.tui.showToast({
            body: {
              title: 'opencoding-agent Update!',
              message: `v${latestVersion} is available. Restart OpenCode to apply.`,
              variant: 'info',
              duration: 8000,
            },
          }).catch(() => {});

          // Invalidate cache
          invalidatePackage();
        } else {
          console.log(`[auto-update] Already on latest version: ${currentVersion}`);
        }
      }, 0);
    },
  };
}
