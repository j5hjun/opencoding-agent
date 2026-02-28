import { planAgent } from "./plan";
import { buildAgent } from "./build";

export const injectAgents = async (config: any) => {
  config.agent = {
    ...config.agent,
    
    // Disable default agents
    "build": { disable: true },
    "plan": { disable: true },

    // Inject our opencoding- prefixed agents
    "opencoding-plan": {
      ...planAgent,
      ...(config.agent?.["opencoding-plan"] ?? {}),
      disable: false
    },
    "opencoding-build": {
      ...buildAgent,
      ...(config.agent?.["opencoding-build"] ?? {}),
      disable: false
    }
  };

  config.default_agent = "opencoding-plan";
};
