import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const ensureSymlink = (source: string, target: string, type: 'dir' | 'file') => {
  if (!fs.existsSync(source)) {
    logger.warn(`Source not found: ${source}`);
    return;
  }

  if (fs.existsSync(target)) {
    try {
      const stats = fs.lstatSync(target);
      if (stats.isSymbolicLink()) {
        const currentLink = fs.readlinkSync(target);
        if (path.resolve(currentLink) === path.resolve(source)) {
          return;
        }
      }
    } catch (e) {}
    
    logger.info(`Updating link: ${target}`);
    fs.rmSync(target, { recursive: true, force: true });
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });

  try {
    fs.symlinkSync(source, target, type);
    logger.info(`Created link: ${target} -> ${source}`);
  } catch (err) {
    logger.error(`Failed to create link ${target}`, err);
  }
};
