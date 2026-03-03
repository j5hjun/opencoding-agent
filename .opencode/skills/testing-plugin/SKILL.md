---
name: testing-plugin
description: Use when verifying that opencoding-agent and superpowers are correctly loaded, symlinked, and functioning as intended in a fresh environment.
---

# Testing Plugin

## Overview
This skill provides a systematic, brainstorming-style workflow for verifying the "Zero-Config" setup and the intelligent guardrail functionality of `opencoding-agent`.

<HARD-GATE>
Do NOT claim the plugin is fully functional or ready for production until EVERY item in the checklist is verified in order. "Passing unit tests" is not enough; E2E behavior must be confirmed.
</HARD-GATE>

## Checklist
You MUST complete these items in order:

1.  **Local Integrity Check** — Unit tests and build must pass to ensure core logic is intact.
2.  **Sandbox Environment Verification** — `test-dir` must be correctly configured to use the local plugin.
3.  **Guardrail Scenario Simulation** — Core features (TDD enforcement, Design Approval) must be verified via actual or simulated tool calls.
4.  **Installation & Identity Audit** — Physical symlinks and the agent's identity/knowledge of superpowers must be verified.

## Workflow

### 1. Local Integrity Check
- **Build**: Run `bun run build` and ensure `dist/` is updated.
- **Unit Tests**: Run `bun test` and verify all 56+ tests pass.

### 2. Sandbox Environment Verification
- **Config**: Ensure `test-dir/opencode.json` contains:
  ```json
  { "plugin": ["file:///path/to/opencoding-agent"] }
  ```
- **CLI Check**: Run `opencode --version` inside `test-dir`.

### 3. Guardrail Scenario Simulation
- **Design Approval**: Attempt to call `writing-plans` for an unapproved topic and verify it's blocked.
- **TDD RED Phase**: Attempt to `edit` a source file without a failing test and verify it's blocked.
- **TDD GREEN/REFACTOR**: Verify `edit` is allowed after a test has passed or failed.
- **Feedback**: Confirm Toast notifications and clear Korean guidance messages appear in logs.

### 4. Installation & Identity Audit
- **Symlinks**: Verify `~/.config/opencode/skills/superpowers` exists and is a directory/link.
- **Bootstrap**: Run `opencode run "Do you have superpowers?"` and verify the agent describes TDD and Design Approval workflows.

## Common Mistakes
- **Skipping Build**: Forgetting to run `tsc` before testing changes in `test-dir`.
- **Absolute Paths**: Using relative paths in `opencode.json` which fail when loaded by the OpenCode server.
- **Stale State**: Forgetting that `SuperpowersManager` is in-memory and might need a fresh session for certain tests.
