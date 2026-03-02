import { mainAgent } from "./agent";

export const injectAgents = async (config: any) => {
  config.agent = {
    ...config.agent,
    
    // Disable default build agent, but keep default plan agent
    "build": { disable: true },
    "plan": { disable: false },

    // Inject our opencoding-agent
    "opencoding-agent": {
      ...mainAgent,
      disable: false
    }
  };

  config.default_agent = "opencoding-agent";
};
