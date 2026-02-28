export type AgentInfo = {
  name: string;
  description: string;
  mode: string;
  color: string;
  permission: Record<string, string>;
  prompt?: string;
};

export const PLUGIN_NAME = "opencoding-agent";
