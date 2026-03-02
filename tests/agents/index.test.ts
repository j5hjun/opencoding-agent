import { expect, test, describe } from "bun:test";
import { injectAgents } from "../../src/agents/index";

describe("Agent Injection Logic", () => {
  test("should correctly inject opencoding-agent and set it as default", async () => {
    const config: any = {
      agent: {
        "build": { disable: false },
        "plan": { disable: false }
      },
      default_agent: "plan"
    };

    await injectAgents(config);

    // Verify default agents are disabled/enabled correctly
    expect(config.agent.build.disable).toBe(true);
    expect(config.agent.plan.disable).toBe(false);

    // Verify our custom agent is injected
    expect(config.agent["opencoding-agent"]).toBeDefined();
    expect(config.agent["opencoding-agent"].name).toBe("opencoding-agent");
    expect(config.agent["opencoding-agent"].disable).toBe(false);

    // Verify default_agent setting
    expect(config.default_agent).toBe("opencoding-agent");

    // Verify opencoding-plan is removed (or not present)
    expect(config.agent["opencoding-plan"]).toBeUndefined();
  });
});
