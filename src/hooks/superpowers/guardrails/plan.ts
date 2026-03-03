import { logger } from '../../../utils/index';
import type { GuardrailInput, GuardrailOutput } from './types';

// Integrated Plan Approval State Management
const planApprovals = new Map<string, Record<string, boolean>>();

function isApproved(sessionID: string, topic: string): boolean {
  return planApprovals.get(sessionID)?.[topic] ?? false;
}

function approve(sessionID: string, topic: string): void {
  const state = planApprovals.get(sessionID) || {};
  state[topic] = true;
  planApprovals.set(sessionID, state);
}

/**
 * Plan Enforcement Guardrail
 */
export async function enforcePlan(
  input: GuardrailInput,
  _output: { args: any }
): Promise<void> {
  const { tool, sessionID, args } = input;
  if (tool === 'writing-plans' && args?.topic) {
    if (!isApproved(sessionID, args.topic)) {
      const message = `[Superpowers Guardrail] 설계 승인(brainstorming)이 필요합니다. '${args.topic}'에 대한 구현 계획을 작성하기 전에 먼저 brainstorming을 통해 설계를 승인받으세요.`;
      logger.warn(message, 'Superpowers Guardrail');
      throw new Error(message);
    }
  }
}

/**
 * Plan Approval Detection
 */
export async function monitorPlan(
  input: GuardrailInput,
  output: GuardrailOutput
): Promise<void> {
  const { tool, sessionID, args } = input;
  if (tool === 'question' && output.output.includes('승인')) {
    const header = args?.header || (output.metadata?.args?.header);
    if (typeof header === 'string' && header.startsWith('Design Approval: ')) {
      approve(sessionID, header.replace('Design Approval: ', '').trim());
    }
  }
}
