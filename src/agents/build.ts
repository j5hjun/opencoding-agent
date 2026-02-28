import type { AgentInfo } from "../config";

export const buildAgent: AgentInfo = {
  name: "opencoding-build",
  description: "The default agent. Executes tools based on configured permissions.",
  mode: "primary",
  color: "#e74c3c",
  permission: {
    "*": "allow"
  }
};
