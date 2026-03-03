import { tool } from "@opencode-ai/plugin";

const REPO_URL = "https://raw.githubusercontent.com/obra/superpowers/main";

export const listTool = tool({
  description: "List all available subagent categories and the number of agents in each.",
  args: {},
  execute: async () => {
    try {
      const url = `${REPO_URL}/catalog.json?t=${Date.now()}`;
      const response = await fetch(url);
      if (!response.ok) {
        return `Fetch failed for ${url}: ${response.status} ${response.statusText}`;
      }
      const catalog = await response.json() as any[];
      
      const categories = catalog.reduce((acc: Record<string, number>, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});

      let output = "Available Subagent Categories:\n\n";
      for (const [name, count] of Object.entries(categories)) {
        output += `- ${name}: ${count} agents\n`;
      }
      output += "\nUse subagent-catalog:search to find specific agents.";
      return output;
    } catch (error: any) {
      return `Error fetching catalog: ${error.message}`;
    }
  }
});
