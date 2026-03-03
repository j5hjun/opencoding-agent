import { translator } from './translator';
import { tester } from './tester';
import { sequencer } from './sequencer';
import path from 'path';
import fs from 'fs';
import { getPluginRoot, getConfigDir } from '../../utils/paths';
import { logger } from '../../utils/logger';
import type { Hooks } from "@opencode-ai/plugin";

/**
 * Extracts and strips frontmatter from a markdown string.
 */
const extractAndStripFrontmatter = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content };

  const frontmatterStr = match[1];
  const body = match[2];
  const frontmatter: Record<string, string> = {};

  for (const line of frontmatterStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, content: body };
};

/**
 * Loads the bootstrap system prompt for Superpowers.
 */
const getBootstrapContent = () => {
  try {
    const pluginRoot = getPluginRoot();
    const configDir = getConfigDir();
    const superpowersSkillsDir = path.resolve(pluginRoot, 'src/skills/superpowers');
    
    const skillPath = path.join(superpowersSkillsDir, 'using-superpowers', 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      logger.warn('Superpowers bootstrap skill not found', 'Plugin Init');
      return null;
    }

    const fullContent = fs.readFileSync(skillPath, 'utf8');
    const { content } = extractAndStripFrontmatter(fullContent);

    const toolMapping = `**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \`TodoWrite\` → \`update_plan\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → OpenCode's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools

**Skills location:**
Superpowers skills are in \`${configDir}/skills/superpowers/\`
Use OpenCode's native \`skill\` tool to list and load skills.`;

    return `<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use the skill tool to load "using-superpowers" again - that would be redundant.**

${content}

${toolMapping}
</EXTREMELY_IMPORTANT>`;
  } catch (error) {
    logger.error(`Error loading bootstrap content: ${error}`, 'Plugin Init');
    return null;
  }
};

/**
 * Integrated Superpowers Hooks
 */
export const superpowersHooks: Hooks = {
  'experimental.chat.system.transform': async (_input, output) => {
    const bootstrap = getBootstrapContent();
    if (bootstrap) {
      (output.system ||= []).push(bootstrap);
    }
  },
  'tool.execute.before': async (input, output) => {
    // 1. Enforce workflow rules (Design Approval, TDD)
    await sequencer(input, output);
    // 2. Validate tool names and provide feedback on aliases
    await translator(input, output);
  },
  'tool.execute.after': async (input, output) => {
    // 3. Monitor test results and update TDD status
    await tester(input, output);
  }
};
