import { z } from "zod";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

export type AgentInfo = {
  name: string;
  description: string;
  mode: string;
  color: string;
  permission: Record<string, string>;
  prompt?: string;
};

/**
 * opencoding-agent Configuration Schema
 */
export const PluginConfigSchema = z.object({
  disabled_mcps: z.array(z.string()).optional(),
  // Add other config items as needed
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;

export const PLUGIN_NAME = "opencoding-agent";

/**
 * Loads the plugin configuration from the home directory or project directory.
 * Path: ~/.config/opencode/opencoding-agent.json or <project_dir>/.opencoding-agent.json
 */
export function loadPluginConfig(projectDir?: string): PluginConfig {
  const globalConfigPath = path.join(os.homedir(), ".config", "opencode", `${PLUGIN_NAME}.json`);
  const projectConfigPath = projectDir ? path.join(projectDir, `.${PLUGIN_NAME}.json`) : null;
  
  const configPaths = [projectConfigPath, globalConfigPath].filter(Boolean) as string[];

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const rawContent = fs.readFileSync(configPath, "utf-8");
        const json = JSON.parse(rawContent);
        return PluginConfigSchema.parse(json);
      } catch (error) {
        console.error(`[${PLUGIN_NAME}] Failed to load config from ${configPath}:`, error);
      }
    }
  }

  return {};
}

/**
 * Basic deep merge for configuration objects.
 */
export function deepMerge(target: any, source: any): any {
  if (typeof target !== "object" || target === null || typeof source !== "object" || source === null) {
    return source;
  }

  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (typeof source[key] === "object" && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
