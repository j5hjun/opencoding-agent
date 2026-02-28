import { planAgent } from "./plan";
import { buildAgent } from "./build";

export const injectAgents = async (config: any) => {
  const planPrompt = await Bun.file(`${import.meta.dir}/../prompts/plan.txt`).text();
  const buildPrompt = await Bun.file(`${import.meta.dir}/../prompts/build.txt`).text();

  config.agent = {
    ...config.agent,
    
    // Disable default agents
    "build": { disable: true },
    "plan": { disable: true },

    // Inject our opencoding- prefixed agents
    "opencoding-plan": {
      ...planAgent,
      disable: false,
      prompt: planPrompt
    },
    "opencoding-build": {
      ...buildAgent,
      disable: false,
      prompt: buildPrompt
    }
  };

  config.default_agent = "opencoding-plan";
};
