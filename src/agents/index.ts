import { planAgent } from "./plan";
import { buildAgent } from "./build";
import { deepMerge } from "../config";

export const injectAgents = async (opencodeConfig: any) => {
  const existingAgents = (opencodeConfig.agent ?? {}) as Record<string, any>;

  opencodeConfig.agent = {
    ...existingAgents,
    
    // Disable default agents
    "build": { disable: true },
    "plan": { disable: true },

    // Inject our opencoding- prefixed agents
    "opencoding-plan": deepMerge(planAgent, {
      ...(existingAgents["opencoding-plan"] ?? {}),
      disable: false
    }),
    "opencoding-build": deepMerge(buildAgent, {
      ...(existingAgents["opencoding-build"] ?? {}),
      disable: false
    })
  };

  (opencodeConfig as any).default_agent = "opencoding-plan";
};
