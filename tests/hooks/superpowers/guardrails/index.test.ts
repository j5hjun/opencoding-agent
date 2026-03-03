import { expect, test, describe } from "bun:test";
import { enforceTDD, monitorTests, enforcePlan, monitorPlan, enforceToolMapping } from "../../../../src/hooks/superpowers/guardrails/index";

describe("Guardrails Gateway (src/hooks/superpowers/guardrails/index.ts)", () => {
  test("should export all guardrail functions", () => {
    expect(enforceTDD).toBeDefined();
    expect(monitorTests).toBeDefined();
    expect(enforcePlan).toBeDefined();
    expect(monitorPlan).toBeDefined();
    expect(enforceToolMapping).toBeDefined();
  });
});
