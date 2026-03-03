import { describe, expect, it } from 'bun:test';
import { enforceToolMapping } from '../../../../src/hooks/superpowers/guardrails/tool-mapping';

describe('Tool Mapping (Superpowers)', () => {
  const sessionID = 'test-session';
  const callID = 'call-123';

  it('should throw an error if an alias is used', async () => {
    const cases = [
      { tool: 'TodoWrite', expected: 'update_plan' },
      { tool: 'Task', expected: 'task' },
      { tool: 'Skill', expected: 'skill' },
      { tool: 'Edit', expected: 'edit' },
      { tool: 'Read', expected: 'read' },
    ];

    for (const c of cases) {
      try {
        await enforceToolMapping({ tool: c.tool, sessionID, callID }, { args: {} });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain(`Please use ${c.expected} instead of ${c.tool}`);
      }
    }
  });

  it('should not throw for canonical tool names', async () => {
    const input = {
      tool: 'update_plan',
      sessionID,
      callID,
    };
    const output = {
      args: { content: 'test' },
    };

    await enforceToolMapping(input, output);
  });
});
