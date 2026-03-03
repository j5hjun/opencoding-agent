import { describe, expect, it, mock } from 'bun:test';
import { SuperpowersPlugin } from '../../../src/hooks/superpowers/superpowers';
import fs from 'fs';

describe('Superpowers Plugin (Ported Logic)', () => {
  it('should generate bootstrap content correctly when file exists', async () => {
    // Mock fs.existsSync to true and fs.readFileSync to return valid frontmatter content
    const existsSpy = mock(() => true);
    const readSpy = mock(() => '---\nname: test\n---\n# Bootstrap Content');
    
    // Inject mocks into the module context if possible, 
    // but since we are using 'import', we might need to mock the global fs or just accept it's hard.
    // In Bun, we can mock fs using Bun.mock
    
    const originalExists = fs.existsSync;
    const originalRead = fs.readFileSync;
    (fs as any).existsSync = existsSpy;
    (fs as any).readFileSync = readSpy;

    try {
      const plugin = await SuperpowersPlugin({ directory: '/mock' });
      const transform = plugin['experimental.chat.system.transform'];
      const output = { system: [] as string[] };
      await transform({}, output);

      expect(output.system.length).toBeGreaterThan(0);
      expect(output.system[0]).toContain('# Bootstrap Content');
      expect(output.system[0]).toContain('**Tool Mapping for OpenCode:**');
    } finally {
      (fs as any).existsSync = originalExists;
      (fs as any).readFileSync = originalRead;
    }
  });

  it('should return empty system prompt when file does not exist', async () => {
    const originalExists = fs.existsSync;
    (fs as any).existsSync = () => false;

    try {
      const plugin = await SuperpowersPlugin({ directory: '/mock' });
      const transform = plugin['experimental.chat.system.transform'];
      const output = { system: [] as string[] };
      await transform({}, output);

      expect(output.system.length).toBe(0);
    } finally {
      (fs as any).existsSync = originalExists;
    }
  });
});
