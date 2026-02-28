
import type { PluginInput } from '@opencode-ai/plugin';
import { getCachedVersion, getLatestVersion, isLocalDevMode } from './checker';
import { invalidatePackage } from './cache';

export function createAutoUpdateHook(ctx: PluginInput) {
  let hasChecked = false;

  return async () => {

    if (hasChecked) return;
    
    hasChecked = true;

    setTimeout(async () => {
      try {

        if (isLocalDevMode(ctx.directory)) {
          await ctx.client.app.log({
            body: {
              service: 'opencoding-agent:auto-update',
              level: 'debug',
              message: 'Local development mode detected. Skipping check.'
            }
          }).catch(() => {});
          return;
        }

        const currentVersion = getCachedVersion();
        const latestVersion = await getLatestVersion();

        if (!currentVersion || !latestVersion) {
          await ctx.client.app.log({
            body: {
              service: 'opencoding-agent:auto-update',
              level: 'warn',
              message: 'Could not determine versions. Skipping.'
            }
          }).catch(() => {});
          return;
        }

        if (currentVersion !== latestVersion) {
          await ctx.client.app.log({
            body: {
              service: 'opencoding-agent:auto-update',
              level: 'info',
              message: `Update available: ${currentVersion} → ${latestVersion}`
            }
          }).catch(() => {});
          

          ctx.client.tui.showToast({
            body: {
              title: 'opencoding-agent Update!',
              message: `v${latestVersion} is available. Restart OpenCode to apply.`,
              variant: 'info',
              duration: 8000,
            },
          }).catch(() => {});

          invalidatePackage();
        } else {
          await ctx.client.app.log({
            body: {
              service: 'opencoding-agent:auto-update',
              level: 'debug',
              message: `Already on latest version: ${currentVersion}`
            }
          }).catch(() => {});
        }
      } catch (error: any) {

        await ctx.client.app.log({
          body: {
            service: 'opencoding-agent:auto-update',
            level: 'error',
            message: `Background update check failed: ${error.message}`
          }
        }).catch(() => {});
      }
    }, 0);
  };
}
