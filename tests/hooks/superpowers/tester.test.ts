import { describe, expect, it, beforeEach, spyOn, afterEach } from 'bun:test';
import { tester } from '../../../src/hooks/superpowers/tester';
import { translator } from '../../../src/hooks/superpowers/translator';
import { superpowersManager } from '../../../src/hooks/superpowers/manager';

describe('Superpowers Hooks', () => {
  const sessionID = 'test-session';
  const callID = 'call-123';

  describe('Translator Hook', () => {
    it('should throw an error if an alias is used', async () => {
      const input = {
        tool: 'TodoWrite',
        sessionID,
        callID,
      };
      const output = {
        args: { content: 'test' },
      };

      try {
        await translator(input, output);
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Please use update_plan instead of TodoWrite');
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

      await translator(input, output);
    });
  });

  describe('Tester Hook', () => {
    let markAsFailedSpy: any;
    let markAsPassedSpy: any;

    beforeEach(() => {
      superpowersManager.clear(sessionID);
      markAsFailedSpy = spyOn(superpowersManager, 'markAsFailed');
      markAsPassedSpy = spyOn(superpowersManager, 'markAsPassed');
    });

    afterEach(() => {
      markAsFailedSpy.mockRestore();
      markAsPassedSpy.mockRestore();
    });

    it('should mark as failed if bash command fails with error pattern', async () => {
      const input = {
        tool: 'bash',
        sessionID,
        callID,
        args: { command: 'bun test tests/foo.test.ts' },
      };
      const output = {
        title: 'bash',
        output: 'FAIL: tests/foo.test.ts\n1 tests failed',
        metadata: { exitCode: 1 },
      };

      await tester(input, output);

      expect(markAsFailedSpy).toHaveBeenCalledWith(sessionID, 'tests/foo.test.ts');
    });

    it('should mark as passed if bash command succeeds', async () => {
      const input = {
        tool: 'bash',
        sessionID,
        callID,
        args: { command: 'bun test tests/foo.test.ts' },
      };
      const output = {
        title: 'bash',
        output: 'PASS: tests/foo.test.ts\n1 tests passed',
        metadata: { exitCode: 0 },
      };

      await tester(input, output);

      expect(markAsPassedSpy).toHaveBeenCalledWith(sessionID, 'tests/foo.test.ts');
    });

    it('should support "test" tool and path normalization', async () => {
      const input = {
        tool: 'test',
        sessionID,
        callID,
        args: { path: './tests/bar.test.ts' },
      };
      const output = {
        title: 'test',
        output: 'PASS',
        metadata: { exitCode: 0 },
      };

      await tester(input, output);

      // Should be normalized to 'tests/bar.test.ts'
      expect(markAsPassedSpy).toHaveBeenCalledWith(sessionID, 'tests/bar.test.ts');
    });

    it('should ignore non-test related errors', async () => {
      const input = {
        tool: 'bash',
        sessionID,
        callID,
        args: { command: 'bun test tests/foo.test.ts' },
      };
      const output = {
        title: 'bash',
        output: 'Some random error log unrelated to tests',
        metadata: { exitCode: 0 },
      };

      await tester(input, output);

      expect(markAsFailedSpy).not.toHaveBeenCalled();
      expect(markAsPassedSpy).toHaveBeenCalled();
    });

    it('should mark as failed for errors containing "expect"', async () => {
      const input = {
        tool: 'bash',
        sessionID,
        callID,
        args: { command: 'bun test tests/foo.test.ts' },
      };
      const output = {
        title: 'bash',
        output: 'error: expect(received).toBe(expected)',
        metadata: { exitCode: 0 },
      };

      await tester(input, output);

      expect(markAsFailedSpy).toHaveBeenCalledWith(sessionID, 'tests/foo.test.ts');
    });

    it('should not mark anything if it is not a test-related bash command', async () => {
      const input = {
        tool: 'bash',
        sessionID,
        callID,
        args: { command: 'ls -R' },
      };
      const output = {
        title: 'bash',
        output: 'src\ntests',
        metadata: { exitCode: 0 },
      };

      await tester(input, output);

      expect(markAsFailedSpy).not.toHaveBeenCalled();
      expect(markAsPassedSpy).not.toHaveBeenCalled();
    });

    it('should mark as approved if question tool gets "승인" with design approval header', async () => {
      const input = {
        tool: 'question',
        sessionID,
        callID,
        args: { header: 'Design Approval: Superpowers Feature' },
      };
      const output = {
        title: 'question',
        output: '네, 승인합니다.',
        metadata: { args: { header: 'Design Approval: Superpowers Feature' } },
      };

      await tester(input, output);

      expect(superpowersManager.isApproved(sessionID, 'Superpowers Feature')).toBe(true);
    });
  });
});
