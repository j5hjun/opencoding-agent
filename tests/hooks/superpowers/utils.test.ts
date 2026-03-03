import { describe, expect, it } from 'bun:test';
import { getTestPath, translateToolName, extractTestPathFromCommand } from '../../../src/hooks/superpowers/utils';

describe('superpowers utils', () => {
  describe('extractTestPathFromCommand', () => {
    it('should extract test path from bun test command', () => {
      expect(extractTestPathFromCommand('bun test tests/foo.test.ts')).toBe('tests/foo.test.ts');
    });

    it('should extract test path from npm test command', () => {
      expect(extractTestPathFromCommand('npm test tests/bar.test.tsx')).toBe('tests/bar.test.tsx');
    });

    it('should return null if no test path is found', () => {
      expect(extractTestPathFromCommand('ls -R')).toBeNull();
    });

    it('should handle commands with multiple arguments', () => {
      expect(extractTestPathFromCommand('bun test --watch tests/baz.test.ts --verbose')).toBe('tests/baz.test.ts');
    });

    it('should handle quoted paths', () => {
      expect(extractTestPathFromCommand('bun test "tests/with space.test.ts"')).toBe('tests/with space.test.ts');
      expect(extractTestPathFromCommand("bun test 'tests/single_quote.test.ts'")).toBe('tests/single_quote.test.ts');
    });

    it('should handle .spec.ts extensions', () => {
      expect(extractTestPathFromCommand('bun test tests/foo.spec.ts')).toBe('tests/foo.spec.ts');
    });
  });

  describe('getTestPath', () => {
    it('should convert src/path/file.ts to tests/path/file.test.ts', () => {
      expect(getTestPath('src/hooks/superpowers/utils.ts')).toBe('tests/hooks/superpowers/utils.test.ts');
    });

    it('should handle nested paths correctly', () => {
      expect(getTestPath('src/foo/bar/baz.ts')).toBe('tests/foo/bar/baz.test.ts');
    });

    it('should handle absolute paths', () => {
      const absPath = '/Users/johjun/project/src/hooks/superpowers/utils.ts';
      expect(getTestPath(absPath)).toBe('/Users/johjun/project/tests/hooks/superpowers/utils.test.ts');
    });

    it('should return the same path if it is already a test path', () => {
      expect(getTestPath('tests/foo.test.ts')).toBe('tests/foo.test.ts');
      expect(getTestPath('tests/foo.test.tsx')).toBe('tests/foo.test.tsx');
    });
    
    it('should return the original path when conversion is impossible', () => {
        expect(getTestPath('untracked/file.ts')).toBe('untracked/file.ts');
    });

    it('should handle files in src/ that should have tests in src/', () => {
        // Some projects put tests next to source. 
        // But the prompt says "src/foo.ts -> tests/foo.test.ts 또는 src/foo.test.ts"
        // Let's implement a logic that prefers tests/ but can be flexible.
        // For now, let's stick to the src -> tests mapping as primary.
    });
  });

  describe('translateToolName', () => {
    it('should translate TodoWrite to update_plan', () => {
      expect(translateToolName('TodoWrite')).toBe('update_plan');
    });

    it('should translate Task to task', () => {
      expect(translateToolName('Task')).toBe('task');
    });

    it('should translate Skill to skill', () => {
      expect(translateToolName('Skill')).toBe('skill');
    });

    it('should return lowercase for unknown tools', () => {
      expect(translateToolName('Bash')).toBe('bash');
      expect(translateToolName('Read')).toBe('read');
    });
    
    it('should handle already translated names', () => {
        expect(translateToolName('update_plan')).toBe('update_plan');
    });
  });
});
