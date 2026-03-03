import { translateToolName } from './utils';

/**
 * Tool Translation Hook (tool.execute.before)
 * 
 * Intercepts tool execution and validates the tool name.
 * If an alias or non-canonical tool name is used, it provides feedback
 * to the agent to use the correct tool name.
 */
export async function translator(
  input: { tool: string; sessionID: string; callID: string; args?: any },
  output: { args: any }
): Promise<void> {
  const { tool } = input;
  const canonical = translateToolName(tool);

  if (canonical !== tool) {
    // We cannot change input.tool at runtime in the SDK easily, 
    // so we provide immediate feedback via an error to guide the agent.
    throw new Error(`Invalid tool: ${tool}. Please use ${canonical} instead of ${tool}.`);
  }
}
