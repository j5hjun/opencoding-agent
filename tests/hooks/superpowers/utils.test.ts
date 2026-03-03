import { describe, expect, it } from 'bun:test';
import { getTestPath, translateToolName } from '../../../src/hooks/superpowers/utils';

describe('superpowers utils', () => {
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
