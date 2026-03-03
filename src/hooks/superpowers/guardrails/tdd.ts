import path from 'path';
import { logger } from '../../../utils/index';
import type { TDDStatus, GuardrailInput, GuardrailOutput } from './types';

// Integrated TDD State Management
const tddStates = new Map<string, Record<string, TDDStatus>>();

function getTDDStatus(sessionID: string, testPath: string): TDDStatus | undefined {
  return tddStates.get(sessionID)?.[testPath];
}

function markAsFailed(sessionID: string, testPath: string): void {
  const state = tddStates.get(sessionID) || {};
  state[testPath] = 'failed';
  tddStates.set(sessionID, state);
}

function markAsPassed(sessionID: string, testPath: string): void {
  const state = tddStates.get(sessionID) || {};
  state[testPath] = 'passed';
  tddStates.set(sessionID, state);
}

/**
 * Converts a source file path to its corresponding test file path.
 */
export function getTestPath(srcPath: string): string {
  if (srcPath.endsWith('.test.ts') || srcPath.endsWith('.test.tsx')) return srcPath;
  const isAbsolute = path.isAbsolute(srcPath);
  let normalizedPath = srcPath;
  let prefix = '';

  if (isAbsolute) {
    const srcIndex = srcPath.lastIndexOf(`${path.sep}src${path.sep}`);
    if (srcIndex !== -1) {
      prefix = srcPath.slice(0, srcIndex + 1);
      normalizedPath = srcPath.slice(srcIndex + 1);
    }
  }

  if (normalizedPath.startsWith(`src${path.sep}`) || normalizedPath.startsWith('src/')) {
    const relativePath = normalizedPath.replace(/^src[\/\\]/, '');
    const ext = path.extname(relativePath);
    const baseName = relativePath.slice(0, -ext.length);
    return path.normalize(path.join(prefix, 'tests', `${baseName}.test${ext}`));
  }
  return srcPath;
}

/**
 * Extracts a test file path from a shell command.
 */
export function extractTestPathFromCommand(command: string): string | null {
  const testPathRegex = /(?:(['"])(.+?\.(?:test|spec)\.(?:tsx|ts|jsx|js))\1)|((?:[^\s'"\\]|\\.)+\.(?:test|spec)\.(?:tsx|ts|jsx|js))/g;
  let match;
  while ((match = testPathRegex.exec(command)) !== null) {
    return path.normalize(match[2] || match[3]);
  }
  return null;
}

/**
 * TDD Enforcement Guardrail
 */
export async function enforceTDD(
  input: GuardrailInput,
  _output: { args: any }
): Promise<void> {
  const { tool, sessionID, args } = input;
  if ((tool === 'edit' || tool === 'write') && args?.filePath?.includes('src')) {
    const testPath = getTestPath(args.filePath);
    if (getTDDStatus(sessionID, testPath) === undefined) {
      const message = `[Superpowers Guardrail] TDD 원칙에 따라, 먼저 실패하는 테스트를 작성하고 실행해야 합니다. '${args.filePath}'를 수정하기 전에 '${testPath}'를 작성하고 실행하여 실패하는 것을 확인하세요.`;
      logger.warn(message, 'Superpowers Guardrail');
      throw new Error(message);
    }
  }
}

/**
 * TDD Result Monitor
 */
export async function monitorTests(
  input: GuardrailInput,
  output: GuardrailOutput
): Promise<void> {
  const { tool, sessionID, args } = input;
  if ((tool === 'bash' || tool === 'test' || tool === 'bun') && (args?.command || args?.path)) {
    const testPath = extractTestPathFromCommand(args.command || args.path);
    if (testPath) {
      const out = output.output.toLowerCase();
      const failed = out.includes('fail') || out.includes('failed') || (output.metadata?.exitCode !== 0 && output.metadata?.exitCode !== undefined);
      if (failed) markAsFailed(sessionID, path.normalize(testPath));
      else if (out.includes('pass') || out.includes('passed') || output.metadata?.exitCode === 0) markAsPassed(sessionID, path.normalize(testPath));
    }
  }
}
