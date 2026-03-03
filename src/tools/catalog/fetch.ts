import { tool } from "@opencode-ai/plugin";
import { z } from "zod";
import * as path from "path";
import * as os from "os";
import { REPO_URL } from "./constants";
import { logger } from "../../utils/logger";

export const fetchTool = tool({
  description: "Download and install a subagent by name. You can choose to install it globally or locally.",
  args: {
    name: z.string().describe("Name of the agent to fetch"),
    scope: z.enum(["global", "local"]).default("global").describe("Installation scope (global: all projects, local: current project only)")
  },
  execute: async ({ name, scope }, { directory }) => {
    try {
      const catalogUrl = `${REPO_URL}/catalog.json?t=${Date.now()}`;
      const catalogResponse = await fetch(catalogUrl);
      if (!catalogResponse.ok) {
        const err = `Fetch failed for ${catalogUrl}: ${catalogResponse.status} ${catalogResponse.statusText}`;
        logger.error(err);
        return err;
      }
      const catalog = await catalogResponse.json() as any[];
      
      const agent = catalog.find(item => item.name.toLowerCase() === name.toLowerCase());
      if (!agent) {
        const err = `Agent "${name}" not found in the catalog.`;
        logger.warn(err);
        return err;
      }

      const agentUrl = `${REPO_URL}/${agent.path}?t=${Date.now()}`;
      const agentResponse = await fetch(agentUrl);
      if (!agentResponse.ok) {
        const err = `Fetch failed for ${agentUrl}: ${agentResponse.status} ${agentResponse.statusText}`;
        logger.error(err);
        return err;
      }
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

      const successMsg = `Successfully installed **${agent.name}** to ${scope} path`;
      logger.success(successMsg, 'Agent Installed');

      return `✓ ${successMsg}: \`${filePath}\`\n\nYou can now use this agent by saying: "Use the ${agent.name} to [task]"`;
    } catch (error: any) {
      const errMsg = `Error fetching agent: ${error.message}`;
      logger.error(errMsg);
      return errMsg;
    }
  }
});
