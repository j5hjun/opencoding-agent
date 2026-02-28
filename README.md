# opencoding-agent

opencoding-agent is an OpenCode plugin that provides specialized agents and a subagent management system.

## Features

- **Custom Agents**: Replaces default agents with specialized `plan` and `build` modes.
- **Dynamic MCP Injection**: Injects powerful Model Context Protocol (MCP) servers into your environment.
- **Subagent Catalog**: Browse and install subagents from the [awesome-opencode-subagents](https://github.com/j5hjun/awesome-opencode-subagents) repository.

## Built-in MCPs

The following MCP servers are automatically injected and granted full access for `opencoding-plan` and `opencoding-build` agents:

- **websearch**: Real-time web search powered by Exa AI.
- **context7**: Official documentation lookup for libraries.
- **grep_app**: Ultra-fast code search across GitHub repositories.

## Configuration

You can customize the plugin by creating a configuration file at `~/.config/opencode/opencoding-agent.json` or `.opencoding-agent.json` in your project root.

### Disable specific MCPs

If you want to disable specific MCP servers, add them to the `disabled_mcps` list:

```json
{
  "disabled_mcps": ["grep_app"]
}
```

## Installation

Add this plugin to your `opencode.json`:

```json
{
  "plugin": [
    "opencoding-agent"
  ]
}
```

OpenCode automatically installs plugin dependencies at runtime.

## Tools

- `/subagent-catalog:list`: List available subagent categories.
- `/subagent-catalog:search <query>`: Search for specific subagents by name or description.
- `/subagent-catalog:fetch <name> [scope]`: Download and install a subagent (scope: `global` or `local`).

## Development

To install dependencies:

```bash
bun install
```

To build:

```bash
bun run build
```
