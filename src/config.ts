export type AgentInfo = {
  name: string;
  description: string;
  mode: string;
  color: string;
  permission: Record<string, string>;
};

export const PLUGIN_NAME = "opencoding-agent";
