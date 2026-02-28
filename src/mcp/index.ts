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

/**
 * Creates MCP configurations, excluding disabled ones.
 * Supports wildcard (*) and exclusion (!) syntax via parseList.
 */
export function createBuiltinMcps(
  disabledMcps: readonly string[] = [],
): Record<string, McpConfig> {
  const allNames = Object.keys(allBuiltinMcps);
  
  // By default, all builtin MCPs are allowed.
  // We prepend '*' to the list and then apply the disabled list as exclusions.
  const items = ["*", ...disabledMcps.map(name => `!${name}`)];
  const enabledNames = parseList(items, allNames);

  return Object.fromEntries(
    Object.entries(allBuiltinMcps).filter(([name]) => enabledNames.includes(name))
  );
}
