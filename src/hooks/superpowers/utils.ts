import path from 'path';

/**
 * Converts a source file path to its corresponding test file path.
 * Example: src/foo/bar.ts -> tests/foo/bar.test.ts
 */
export function getTestPath(srcPath: string): string {
  if (srcPath.endsWith('.test.ts') || srcPath.endsWith('.test.tsx')) {
    return srcPath;
  }

  const isAbsolute = path.isAbsolute(srcPath);
  let normalizedPath = srcPath;
  let prefix = '';

  if (isAbsolute) {
    const srcSegment = `${path.sep}src${path.sep}`;
    const srcIndex = srcPath.lastIndexOf(srcSegment);
    if (srcIndex !== -1) {
      prefix = srcPath.slice(0, srcIndex + 1);
      normalizedPath = srcPath.slice(srcIndex + 1);
    } else {
      // Fallback for potential forward slashes on Windows
      const srcIndexAlt = srcPath.lastIndexOf('/src/');
      if (srcIndexAlt !== -1) {
        prefix = srcPath.slice(0, srcIndexAlt + 1);
        normalizedPath = srcPath.slice(srcIndexAlt + 1);
      } else {
        console.warn(`[getTestPath] Absolute path does not contain /src/ segment: ${srcPath}`);
      }
    }
  }

  if (normalizedPath.startsWith(`src${path.sep}`) || normalizedPath.startsWith('src/')) {
    const relativePath = normalizedPath.replace(/^src[\/\\]/, '');
    const ext = path.extname(relativePath);
    const baseName = relativePath.slice(0, -ext.length);
    return path.normalize(path.join(prefix, 'tests', `${baseName}.test${ext}`));
  }

  console.warn(`[getTestPath] Could not determine test path for: ${srcPath}`);
  return srcPath;
}

/**
 * Translates tool aliases to their canonical names.
 * Example: TodoWrite -> update_plan
 */
export function translateToolName(alias: string): string {
  const mapping: Record<string, string> = {
    TodoWrite: 'update_plan',
    Task: 'task',
    Skill: 'skill',
  };

  return mapping[alias] || alias.toLowerCase();
}

/**
 * Extracts a test file path from a shell command.
 * Handles potential quotes and identifies .test.ts, .test.tsx, .spec.ts, etc.
 * Example: "bun test 'tests/foo.test.ts'" -> "tests/foo.test.ts"
 */
export function extractTestPathFromCommand(command: string): string | null {
  // Regex to find potential test file paths (supports .test or .spec with various extensions)
  // Group 2 handles quoted paths, Group 3 handles unquoted paths
  const testPathRegex = /(?:(['"])(.+?\.(?:test|spec)\.(?:tsx|ts|jsx|js))\1)|((?:[^\s'"\\]|\\.)+\.(?:test|spec)\.(?:tsx|ts|jsx|js))/g;
  let match;
  
  while ((match = testPathRegex.exec(command)) !== null) {
    const pathPart = match[2] || match[3];
    return path.normalize(pathPart);
  }
  
  return null;
}
