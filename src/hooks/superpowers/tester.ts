import { superpowersManager } from './manager';
import { extractTestPathFromCommand } from './utils';
import path from 'path';

/**
 * Test Result Detection Hook (tool.execute.after)
 * 
 * Monitors the output of test commands (via bash) and updates
 * the TDD status in SuperpowersManager.
 */
export async function tester(
  input: { tool: string; sessionID: string; callID: string; args: any },
  output: { title: string; output: string; metadata: any }
): Promise<void> {
  const { tool, sessionID, args } = input;

  // Monitor 'bash' or specialized test tools
  if ((tool === 'bash' || tool === 'test' || tool === 'bun') && args && (typeof args.command === 'string' || typeof args.path === 'string')) {
    const command = args.command || args.path;
    const rawTestPath = extractTestPathFromCommand(command);
    
    if (rawTestPath) {
      const testPath = path.normalize(rawTestPath);
      
      // Determine if the test failed based on output patterns or exit code
      // We look for specific "fail" indicators to avoid false positives from general "error" logs
      const outputLower = output.output.toLowerCase();
      const hasFailPattern = output.output.includes('FAIL') || 
                             outputLower.includes('failed') ||
                             /\berror:\s+expect\b/i.test(outputLower) ||
                             /\btests?:\s+\d+\s+failed\b/i.test(outputLower);
      
      const hasExitError = output.metadata && 
                           typeof output.metadata.exitCode === 'number' && 
                           output.metadata.exitCode !== 0;

      if (hasFailPattern || hasExitError) {
        superpowersManager.markAsFailed(sessionID, testPath);
      } else if (output.output.includes('PASS') || outputLower.includes('passed') || (output.metadata && output.metadata.exitCode === 0)) {
        superpowersManager.markAsPassed(sessionID, testPath);
      }
    }
  }
}
