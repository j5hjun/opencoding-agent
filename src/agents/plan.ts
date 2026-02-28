import type { AgentInfo } from "../config";

export const planAgent: AgentInfo = {
  name: "opencoding-plan",
  description: "Plan mode. Disallows all edit tools.",
  mode: "primary",
  color: "#3498db",
  permission: {
    "*": "allow",
    "edit": "deny",
    "write": "deny",
    "apply_patch": "deny"
  }
};
