import { context7 } from './context7';
import { grep_app } from './grep-app';
import type { McpConfig } from './types';
import { websearch } from './websearch';
import { parseList } from '../config/mcp-parser';

export type { LocalMcpConfig, McpConfig, RemoteMcpConfig } from './types';

const allBuiltinMcps: Record<string, McpConfig> = {
  websearch,
  context7,
  grep_app,
};

export function createBuiltinMcps(
  disabledMcps: readonly string[] = [],
): Record<string, McpConfig> {
  const allNames = Object.keys(allBuiltinMcps);
  

  const items = ["*", ...disabledMcps.map(name => `!${name}`)];
  const enabledNames = parseList(items, allNames);

  return Object.fromEntries(
    Object.entries(allBuiltinMcps).filter(([name]) => enabledNames.includes(name))
  );
}
