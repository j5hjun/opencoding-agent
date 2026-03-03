import { expect, test, describe, beforeEach } from "bun:test";
import { superpowersManager } from "../src/hooks/superpowers/manager";
import { sequencer } from "../src/hooks/superpowers/sequencer";
import { tester } from "../src/hooks/superpowers/tester";

describe("Superpowers Guardrails Demonstration", () => {
  const sessionID = "demo-session";

  beforeEach(() => {
    superpowersManager.clear(sessionID);
  });

  test("1. Design Approval Guardrail: Blocks writing-plans without approval", async () => {
    const input = {
      tool: "writing-plans",
      sessionID,
      callID: "call-1",
      args: { topic: "new-feature" }
    };

    // Should fail because topic "new-feature" is not approved
    await expect(sequencer(input as any, {} as any)).rejects.toThrow(/설계 승인\(brainstorming\)이 필요합니다/);

    // Simulate approval via question tool
    await tester(
      { tool: "question", sessionID, callID: "call-2" } as any,
      { output: "네, 설계를 승인합니다.", metadata: { args: { header: "Design Approval: new-feature" } } } as any
    );

    // Now it should pass
    await sequencer(input as any, {} as any);
  });

  test("2. TDD Guardrail: Blocks code edit without failing test (RED Phase)", async () => {
    const sourcePath = "src/logic.ts";

    const input = {
      tool: "edit",
      sessionID,
      callID: "call-3",
      args: { filePath: sourcePath }
    };

    // Should fail because test hasn't failed yet
    await expect(sequencer(input as any, {} as any)).rejects.toThrow(/TDD 원칙에 따라, 먼저 실패하는 테스트를 작성하고 실행해야 합니다/);

    // Simulate test failure (RED)
    await tester(
      { tool: "bash", sessionID, callID: "call-4", args: { command: "bun test tests/logic.test.ts" } } as any,
      { output: "FAIL: tests/logic.test.ts\nExpected 1 but got 0", exitCode: 1 } as any
    );

    // Now it should pass (RED phase achieved)
    await sequencer(input as any, {} as any);
  });

  test("3. TDD Guardrail: Allows code edit in REFACTOR Phase (test passed)", async () => {
    const sourcePath = "src/logic.ts";

    const input = {
      tool: "edit",
      sessionID,
      callID: "call-5",
      args: { filePath: sourcePath }
    };

    // Should fail initially
    await expect(sequencer(input as any, {} as any)).rejects.toThrow(/TDD 원칙에 따라, 먼저 실패하는 테스트를 작성하고 실행해야 합니다/);

    // Simulate test success (GREEN)
    await tester(
      { tool: "bash", sessionID, callID: "call-6", args: { command: "bun test tests/logic.test.ts" } } as any,
      { output: "PASS: tests/logic.test.ts", exitCode: 0 } as any
    );

    // Now it should pass (REFACTOR phase allowed)
    await sequencer(input as any, {} as any);
  });
});
