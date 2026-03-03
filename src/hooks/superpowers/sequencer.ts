import path from 'path';
import { superpowersManager } from './manager';
import { getTestPath } from './utils';
import { logger } from '../../utils/logger';

/**
 * Tool Execution Sequencer Hook (tool.execute.before)
 * 
 * Enforces workflow rules:
 * 1. Design Approval: Block writing-plans if the topic is not approved via brainstorming.
 * 2. TDD Enforcement: Block editing/writing source files if the corresponding test has not failed.
 */
export async function sequencer(
  input: { tool: string; sessionID: string; callID: string; args?: any },
  _output: { args: any }
): Promise<void> {
  const { tool, sessionID, args } = input;

  // Rule 1: Design Approval
  if (tool === 'writing-plans' && args && typeof args.topic === 'string') {
    if (!superpowersManager.isApproved(sessionID, args.topic)) {
      const message = `[Superpowers Guardrail] 설계 승인(brainstorming)이 필요합니다. '${args.topic}'에 대한 구현 계획을 작성하기 전에 먼저 brainstorming을 통해 설계를 승인받으세요.`;
      logger.warn(message, 'Superpowers Guardrail');
      throw new Error(message);
    }
  }

  // Rule 2: TDD Enforcement
  if ((tool === 'edit' || tool === 'write') && args && typeof args.filePath === 'string') {
    const filePath = args.filePath;
    
    // Check if it's a source file (typically in src/ directory)
    const normalizedPath = path.normalize(filePath);
    const isSourceFile = normalizedPath.split(path.sep).includes('src');

    if (isSourceFile) {
      const testPath = getTestPath(filePath);
      const status = superpowersManager.getTDDStatus(sessionID, testPath);
      
      // Only block if the test status is undefined (never tested)
      // Both 'failed' (Red phase) and 'passed' (Green/Refactor phase) are allowed
      if (status === undefined) {
        const message = `[Superpowers Guardrail] TDD 원칙에 따라, 먼저 실패하는 테스트를 작성하고 실행해야 합니다. '${filePath}'를 수정하기 전에 '${testPath}'를 작성하고 실행하여 실패하는 것을 확인하세요.`;
        logger.warn(message, 'Superpowers Guardrail');
        throw new Error(message);
      }
    }
  }
}
