export const logger = {
  info: (msg: string) => console.log(`[opencoding-agent] ${msg}`),
  warn: (msg: string) => console.warn(`[opencoding-agent] ${msg}`),
  error: (msg: string, err?: any) => {
    console.error(`[opencoding-agent] ${msg}`, err || '');
  }
};
