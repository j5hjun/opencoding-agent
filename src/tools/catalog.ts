import { tool } from "@opencode-ai/plugin";
import { z } from "zod";
import * as path from "path";
import * as os from "os";

const REPO_URL = "https://raw.githubusercontent.com/j5hjun/awesome-opencode-subagents/main";

export const catalogTools = {
  "subagent-catalog:list": tool({
    description: "List all available subagent categories and the number of agents in each.",
    args: {},
    execute: async () => {
      try {
        const url = `${REPO_URL}/catalog.json?t=${Date.now()}`;
        console.log(`Fetching catalog from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
          const errorMsg = `Fetch failed for ${url}: ${response.status} ${response.statusText}`;
          console.error(errorMsg);
          return errorMsg;
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
  }),

  "subagent-catalog:search": tool({
    description: "Search for subagents by name, description, or category.",
    args: {
      query: z.string().describe("Search term"),
      category: z.string().optional().describe("Filter by category")
    },
    execute: async ({ query, category }) => {
      try {
        const url = `${REPO_URL}/catalog.json?t=${Date.now()}`;
        const response = await fetch(url);
        if (!response.ok) return `Fetch failed for ${url}: ${response.status} ${response.statusText}`;
        const catalog = await response.json() as any[];
        
        const results = catalog.filter(item => {
          const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                               item.description.toLowerCase().includes(query.toLowerCase());
          const matchesCategory = !category || item.category.toLowerCase() === category.toLowerCase();
          return matchesQuery && matchesCategory;
        });

        if (results.length === 0) return "No agents found matching your search.";

        let output = `Search Results for "${query}":\n\n`;
        for (const item of results) {
          output += `### ${item.name}\n`;
          output += `**Category**: ${item.category}\n`;
          output += `**Description**: ${item.description}\n\n`;
        }
        output += "Use subagent-catalog:fetch to install an agent.";
        return output;
      } catch (error: any) {
        return `Error searching catalog: ${error.message}`;
      }
    }
  }),

  "subagent-catalog:fetch": tool({
    description: "Download and install a subagent by name. You can choose to install it globally or locally.",
    args: {
      name: z.string().describe("Name of the agent to fetch"),
      scope: z.enum(["global", "local"]).default("global").describe("Installation scope (global: all projects, local: current project only)")
    },
    execute: async ({ name, scope }, { directory }) => {
      try {
        const catalogUrl = `${REPO_URL}/catalog.json?t=${Date.now()}`;
        const catalogResponse = await fetch(catalogUrl);
        if (!catalogResponse.ok) return `Fetch failed for ${catalogUrl}: ${catalogResponse.status} ${catalogResponse.statusText}`;
        const catalog = await catalogResponse.json() as any[];
        
        const agent = catalog.find(item => item.name.toLowerCase() === name.toLowerCase());
        if (!agent) return `Agent "${name}" not found in the catalog.`;

        const agentUrl = `${REPO_URL}/${agent.path}?t=${Date.now()}`;
        const agentResponse = await fetch(agentUrl);
        if (!agentResponse.ok) return `Fetch failed for ${agentUrl}: ${agentResponse.status} ${agentResponse.statusText}`;
        const content = await agentResponse.text();

        let targetDir: string;
        if (scope === "global") {
          targetDir = path.join(os.homedir(), ".config", "opencode", "agents");
        } else {
          targetDir = path.join(directory, ".opencode", "agents");
        }

        const fileName = `${agent.name}.md`;
        const filePath = path.join(targetDir, fileName);

        // Ensure directory exists - Bun.write will create the file, but we might need to create the directory
        const fs = await import("fs/promises");
        await fs.mkdir(targetDir, { recursive: true });
        await Bun.write(filePath, content);

        return `✓ Successfully installed **${agent.name}** to ${scope} path: \`${filePath}\`\n\nYou can now use this agent by saying: "Use the ${agent.name} to [task]"`;
      } catch (error: any) {
        return `Error fetching agent: ${error.message}`;
      }
    }
  })
};
