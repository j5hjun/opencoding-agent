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
      disable: false
    },
    "opencoding-build": {
      ...buildAgent,
      disable: false
    }
  };

  config.default_agent = "opencoding-plan";
};
