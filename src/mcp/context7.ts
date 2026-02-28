import type { RemoteMcpConfig } from './types';

export const context7: RemoteMcpConfig = {
  type: 'remote',
  url: 'https://mcp.context7.com/mcp',
  headers: process.env.CONTEXT7_API_KEY
    ? { CONTEXT7_API_KEY: process.env.CONTEXT7_API_KEY }
    : undefined,
  oauth: false,
};
