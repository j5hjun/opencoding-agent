import { showToast } from './toast';

/**
 * Enhanced logger for opencoding-agent.
 * Supports standard console logging (stderr) and optional TUI toast notifications
 * when a client is injected.
 */

let clientInstance: any = null;

export const logger = {
  /**
   * Injects the OpenCode client to enable TUI features like toasts.
   */
  setClient: (client: any) => {
    clientInstance = client;
  },

  info: (msg: string) => {
    console.error(`[opencoding-agent] ${msg}`);
  },

  success: (msg: string, title?: string) => {
    console.error(`[opencoding-agent] SUCCESS: ${msg}`);
    if (clientInstance) {
      showToast(clientInstance, {
        title: title || 'Success',
        message: msg,
        variant: 'success'
      });
    }
  },

  warn: (msg: string, title?: string) => {
    console.warn(`[opencoding-agent] ${msg}`);
    if (clientInstance) {
      showToast(clientInstance, {
        title: title || 'Warning',
        message: msg,
        variant: 'warning'
      });
    }
  },

  error: (msg: string, err?: any, title?: string) => {
    console.error(`[opencoding-agent] ${msg}`, err || '');
    if (clientInstance) {
      showToast(clientInstance, {
        title: title || 'Error',
        message: msg,
        variant: 'error'
      });
    }
  }
};
