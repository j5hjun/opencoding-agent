import { tool } from "@opencode-ai/plugin";
import { z } from "zod";
import { REPO_URL } from "./constants";
import { logger } from "../../utils/logger";

export const searchTool = tool({
  description: "Search for subagents by name, description, or category.",
  args: {
    query: z.string().describe("Search term"),
    category: z.string().optional().describe("Filter by category")
  },
  execute: async ({ query, category }) => {
    try {
      const url = `${REPO_URL}/catalog.json?t=${Date.now()}`;
      logger.info(`Searching catalog at: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        const err = `Fetch failed for ${url}: ${response.status} ${response.statusText}`;
        logger.error(err);
        return err;
      }
      const catalog = await response.json() as any[];
      
      const results = catalog.filter(item => {
        const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                             item.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = !category || item.category.toLowerCase() === category.toLowerCase();
        return matchesQuery && matchesCategory;
      });

      if (results.length === 0) {
        const msg = `No agents found matching "${query}"`;
        logger.warn(msg, 'Search Result');
        return msg;
      }

      let output = `Search Results for "${query}":\n\n`;
      for (const item of results) {
        output += `### ${item.name}\n`;
        output += `**Category**: ${item.category}\n`;
        output += `**Description**: ${item.description}\n\n`;
      }
      output += "Use subagent-catalog:fetch to install an agent.";
      return output;
    } catch (error: any) {
      const errMsg = `Error searching catalog: ${error.message}`;
      logger.error(errMsg);
      return errMsg;
    }
  }
});
