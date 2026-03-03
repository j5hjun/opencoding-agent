import { describe, expect, it, beforeEach, spyOn, afterEach } from 'bun:test';
import { enforceTDD, monitorTests, getTestPath, extractTestPathFromCommand } from '../../../../src/hooks/superpowers/guardrails/tdd';

describe('TDD Hook', () => {
  const sessionID = 'test-session';
  const callID = 'call-123';

  describe('TDD Internals', () => {
    it('should convert src to tests path', () => {
      expect(getTestPath('src/logic.ts')).toBe('tests/logic.test.ts');
    });

    it('should extract path from command', () => {
      expect(extractTestPathFromCommand('bun test tests/foo.test.ts')).toBe('tests/foo.test.ts');
    });
  });

  describe('enforceTDD', () => {
    it('should block edit on src file if test has not failed', async () => {
      const input = {
        tool: 'edit',
        sessionID: 'session-new-' + Math.random(),
        callID,
        args: { filePath: 'src/hooks/superpowers/tdd.ts' },
      };

      try {
        await enforceTDD(input, { args: {} });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('TDD 원칙');
      }
    });

    it('should allow edit on src file if test has failed', async () => {
      const sID = 'session-fail-' + Math.random();
      const filePath = 'src/hooks/superpowers/tdd.ts';
      const testPath = getTestPath(filePath);

      await monitorTests({
        tool: 'bash',
        sessionID: sID,
        callID,
        args: { command: `bun test ${testPath}` },
      }, {
        title: 'bash',
        output: `FAIL: ${testPath}`,
        metadata: { exitCode: 1 },
      });

      await enforceTDD({
        tool: 'edit',
        sessionID: sID,
        callID,
        args: { filePath },
      }, { args: {} });
    });
  });
});
