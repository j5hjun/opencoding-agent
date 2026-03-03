import { describe, expect, it, beforeEach, spyOn, afterEach, mock } from 'bun:test';
import { sequencer } from '../../../src/hooks/superpowers/sequencer';
import { superpowersManager } from '../../../src/hooks/superpowers/manager';
import * as utils from '../../../src/hooks/superpowers/utils';
import { logger } from '../../../src/utils/logger';

describe('Sequencer Hook', () => {
  const sessionID = 'test-session';
  const callID = 'call-123';
  let loggerWarnSpy: any;

  beforeEach(() => {
    superpowersManager.clear(sessionID);
    loggerWarnSpy = spyOn(logger, 'warn');
  });

  afterEach(() => {
    loggerWarnSpy.mockRestore();
  });

  describe('Rule 1: Design Approval (writing-plans)', () => {
    it('should block writing-plans if topic is not approved', async () => {
      const input = {
        tool: 'writing-plans',
        sessionID,
        callID,
        args: { topic: 'New Feature' },
      };

      try {
        await sequencer(input, { args: {} });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        expect(error.message).toContain('설계 승인');
        expect(error.message).toContain('brainstorming');
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining('설계 승인'),
          'Superpowers Guardrail'
        );
      }
    });

    it('should allow writing-plans if topic is approved', async () => {
      superpowersManager.approve(sessionID, 'New Feature');
      const input = {
        tool: 'writing-plans',
        sessionID,
        callID,
        args: { topic: 'New Feature' },
      };

      await sequencer(input, { args: {} });
      // Should not throw
    });
  });

  describe('Rule 2: TDD Enforcement (edit/write)', () => {
    it('should block edit on src file if test has not failed (undefined status)', async () => {
      const input = {
        tool: 'edit',
        sessionID,
        callID,
        args: { filePath: 'src/hooks/superpowers/sequencer.ts' },
      };

      try {
        await sequencer(input, { args: {} });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('TDD 원칙');
        expect(error.message).toContain('실패하는 테스트');
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining('TDD 원칙'),
          'Superpowers Guardrail'
        );
      }
    });

    it('should allow edit on src file if test has failed (Red phase)', async () => {
      const testPath = utils.getTestPath('src/hooks/superpowers/sequencer.ts');
      superpowersManager.markAsFailed(sessionID, testPath);

      const input = {
        tool: 'edit',
        sessionID,
        callID,
        args: { filePath: 'src/hooks/superpowers/sequencer.ts' },
      };

      await sequencer(input, { args: {} });
      // Should not throw
    });

    it('should allow edit on src file if test has passed (Refactor phase)', async () => {
      const testPath = utils.getTestPath('src/hooks/superpowers/sequencer.ts');
      superpowersManager.markAsPassed(sessionID, testPath);

      const input = {
        tool: 'edit',
        sessionID,
        callID,
        args: { filePath: 'src/hooks/superpowers/sequencer.ts' },
      };

      await sequencer(input, { args: {} });
      // Should not throw
    });

    it('should allow edit on non-src files', async () => {
      const input = {
        tool: 'edit',
        sessionID,
        callID,
        args: { filePath: 'tests/hooks/superpowers/sequencer.test.ts' },
      };

      await sequencer(input, { args: {} });
      // Should not throw
    });
  });
});
