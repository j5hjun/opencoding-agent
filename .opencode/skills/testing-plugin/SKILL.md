---
name: testing-plugin
description: Use when verifying that opencoding-agent and superpowers are correctly loaded and symlinked in a fresh environment.
---

# Testing Plugin

## Overview
This skill provides a systematic workflow for verifying the "Zero-Config" setup of `opencoding-agent` and its bundled `superpowers`.

## When to Use
- After modifying the auto-installer (`linker.ts`)
- After updating bundled superpowers resources
- Before committing changes to the setup logic
- To troubleshoot missing superpowers skills in OpenCode

## Core Workflow

### 1. Preparation (Isolated Environment)
Always test in an isolated directory to avoid polluting your main project.
- Use `test-dir/` as the sandbox.
- Ensure `test-dir/opencode.json` points to the local project: `"plugin": ["file://<absolute-path-to-opencoding-agent>"]`.

### 2. Execution
Run a simple command to trigger the plugin's `Plugin` entry point.
```bash
cd test-dir
opencode run hello --print-logs
```

### 3. Verification Table

| Check | Action | Expected Result |
|-------|--------|-----------------|
| **Symlinks** | `ls -l ~/.config/opencode/skills/superpowers` | Points to `[repo]/src/superpowers/skills` |
| **Plugin Link** | `ls -l ~/.config/opencode/plugins/superpowers.js` | Points to `[repo]/src/superpowers/.opencode/plugins/superpowers.js` |
| **Skill Load** | `skill --list` | `superpowers/` skills appear in the list |
| **Bootstrap** | Ask: "Do you have superpowers?" | Agent mentions TDD, Debugging, or specific instructions |

## Quick Reference
- **Force Re-link**: Delete `~/.config/opencode/skills/superpowers` and restart OpenCode.
- **Log Check**: Look for `[opencoding-agent] Created link` in the logs.

## Common Mistakes
- **Relative Path in Config**: Using relative paths in `opencode.json` can lead to "Module not found" errors. Always use absolute `file://` URLs for local testing.
- **Broken Links**: If the source path changes, the linker might fail if it doesn't have permissions to overwrite. The linker is designed to `rm` and `symlink` if paths mismatch.
