import fs from 'fs';
import path from 'path';
import { getPluginRoot } from '../utils/paths';
import { logger } from '../utils/logger';

export const loadCatalogHooks = async (ctx: any) => {
  const pluginRoot = getPluginRoot();
  const guidePath = path.join(pluginRoot, 'src/prompts/subagent-catalog-guide.md');

  let guideContent = '';
  try {
    if (fs.existsSync(guidePath)) {
      guideContent = fs.readFileSync(guidePath, 'utf8');
    }
  } catch (err) {
    logger.error('Failed to read catalog guide:', err);
  }

  return {
    'experimental.chat.system.transform': async (_input: any, output: any) => {
      if (guideContent) {
        (output.system ||= []).push(`<SUBAGENT_CATALOG_STRATEGY>\n${guideContent}\n</SUBAGENT_CATALOG_STRATEGY>`);
      }
    }
  };
};
