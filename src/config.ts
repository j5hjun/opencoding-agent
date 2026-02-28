import type { Agent } from "@opencode-ai/plugin";

export type AgentInfo = Omit<Agent, "prompt">;

export const PLUGIN_NAME = "opencoding-agent";
