# opencoding-agent

opencoding-agent is an OpenCode plugin that provides specialized agents and a subagent management system.

## Features

- **Custom Agents**: Replaces default agents with specialized `plan` and `build` modes.
- **Subagent Catalog**: Browse and install subagents from the [awesome-opencode-subagents](https://github.com/j5hjun/awesome-opencode-subagents) repository.

## Installation

Add this plugin to your `opencode.json`:

```json
{
  "plugin": [
    "file:///path/to/opencoding-agent/index.ts"
  ]
}
```

## Tools

- `/subagent-catalog:list`: List available subagent categories.
- `/subagent-catalog:search <query>`: Search for specific subagents by name or description.
- `/subagent-catalog:fetch <name> [scope]`: Download and install a subagent (scope: `global` or `local`).

## Development

To install dependencies:

```bash
bun install
```
