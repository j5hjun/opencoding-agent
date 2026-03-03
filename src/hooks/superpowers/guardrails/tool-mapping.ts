/**
 * Tool Mapping Guardrail (Active Enforcer)
 */
export async function enforceToolMapping(
  input: { tool: string; sessionID: string; callID: string; args?: any },
  _output: { args: any }
): Promise<void> {
  const { tool } = input;
  
  const mapping: Record<string, string> = {
    TodoWrite: 'update_plan',
    Task: 'task',
    Skill: 'skill',
    Read: 'read',
    Write: 'write',
    Edit: 'edit',
    Bash: 'bash',
  };

  const canonical = mapping[tool] || tool.toLowerCase();

  if (canonical !== tool) {
    throw new Error(`Invalid tool: ${tool}. Please use ${canonical} instead of ${tool}.`);
  }
}
