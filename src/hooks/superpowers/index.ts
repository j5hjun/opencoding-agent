import { enforceTDD, monitorTests, enforcePlan, monitorPlan, enforceToolMapping } from './guardrails/index';
import { SuperpowersPlugin } from './superpowers';
import type { Hooks } from "@opencode-ai/plugin";

export const getSuperpowersHooks = async (ctx: any): Promise<Hooks> => {
  const superpowersBase = await SuperpowersPlugin(ctx);

  return {
    ...superpowersBase,
    'tool.execute.before': async (input, output) => {
      await enforcePlan(input, output);
      await enforceTDD(input, output);
      await enforceToolMapping(input, output);
    },
    'tool.execute.after': async (input, output) => {
      await monitorPlan(input, output);
      await monitorTests(input, output);
    }
  };
};
