const STRATEGY_GUIDE = `## Subagent Catalog & Strategy Guide

The agent MUST use the subagent-catalog tools to discover and install specialized subagents when facing tasks outside its immediate core capabilities.

### 1. Decision Matrix (When to use the catalog)
- **Unfamiliar Domain**: If you are asked about technologies you have limited data on (e.g., Kubernetes, specialized frameworks), search for a related subagent first.
- **Project Scaffolding**: For starting new projects, use \`list\` to see available scaffolding agents.
- **Complex Debugging**: For deep technical issues, search for 'debugging' or 'performance' specialized agents.
- **Large Scale Refactoring**: When touching many files, look for agents specialized in that specific codebase structure.

### 2. Tool Workflow
1. \`subagent-catalog:list\`: Get an overview of categories.
2. \`subagent-catalog:search\`: Find specific agents by query.
3. \`subagent-catalog:fetch\`: Install the agent (Prefer scope: "local").

### 3. Collaboration Strategy
Once a subagent is installed, ALWAYS mention them using \`@subagent-name\` for the first interaction to establish context and delegate tasks.`;

export const loadCatalogHooks = async (_ctx: any) => {
  return {
    'experimental.chat.system.transform': async (_input: any, output: any) => {
      (output.system ||= []).push(`<SUBAGENT_CATALOG_STRATEGY>\n${STRATEGY_GUIDE}\n</SUBAGENT_CATALOG_STRATEGY>`);
    }
  };
};
