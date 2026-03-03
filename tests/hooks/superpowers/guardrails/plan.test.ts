import { describe, expect, it } from 'bun:test';
import { enforcePlan, monitorPlan } from '../../../../src/hooks/superpowers/guardrails/plan';

describe('Plan Hook', () => {
  const sessionID = 'test-session-plan';
  const callID = 'call-123';

  describe('enforcePlan', () => {
    it('should block writing-plans if topic is not approved', async () => {
      const input = {
        tool: 'writing-plans',
        sessionID: 'new-plan-session',
        callID,
        args: { topic: 'New Feature' },
      };

      try {
        await enforcePlan(input, { args: {} });
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('설계 승인');
      }
    });

    it('should allow writing-plans if topic is approved', async () => {
      const sessionID = 'approved-session';
      // Approve first
      await monitorPlan({
        tool: 'question',
        sessionID,
        callID,
        args: { header: 'Design Approval: Feature X' }
      }, {
        title: 'question',
        output: '승인합니다',
        metadata: { args: { header: 'Design Approval: Feature X' } }
      });

      const input = {
        tool: 'writing-plans',
        sessionID,
        callID,
        args: { topic: 'Feature X' },
      };

      await enforcePlan(input, { args: {} });
      // Should not throw
    });
  });
});
