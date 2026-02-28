import type { AgentInfo } from "../config";

export const buildAgent: AgentInfo = {
  name: "opencoding-build",
  description: "The default agent. Executes tools based on configured permissions.",
  mode: "primary",
  color: "#e74c3c",
  permission: {
    "*": "allow"
  },
  prompt: `<system-reminder>
Your operational mode has changed from plan to build.
You are no longer in read-only mode.
You are permitted to make file changes, run shell commands, and utilize your arsenal of tools as needed.
</system-reminder>`
};
