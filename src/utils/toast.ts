/**
 * Utility for showing safe toast notifications in the OpenCode TUI.
 * Wraps client calls in try/catch to handle environments where TUI is unavailable.
 */

export interface ToastOptions {
  title?: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

/**
 * Shows a toast notification if the client and TUI are available.
 * Fails silently if TUI is not supported.
 */
export const showToast = async (client: any, options: ToastOptions) => {
  try {
    if (client?.tui?.showToast) {
      await client.tui.showToast({
        body: {
          title: options.title,
          message: options.message,
          variant: options.variant,
          duration: options.duration || 5000,
        },
      });
    }
  } catch (err) {
    // Silent fail - TUI might not be available
  }
};
