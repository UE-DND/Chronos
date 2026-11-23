---
name: svelte-code-writer
description: Use the Svelte documentation and autofixer CLI when Svelte assistance is needed and MCP tools are unavailable.
---

Adapted from the [official Svelte skill](https://github.com/sveltejs/ai-tools/tree/svelte-code-writer-v2026.10.26-045239/tools/skills/svelte-code-writer).

## CLI tools

Run the `@sveltejs/mcp` CLI with `vpx`.

### List documentation sections

```bash
vpx @sveltejs/mcp list-sections
```

Lists all available Svelte 5 and SvelteKit documentation sections with titles and paths.

### Get documentation

```bash
vpx @sveltejs/mcp get-documentation "<section1>,<section2>,..."
```

Retrieves full documentation for specified sections. Use `list-sections` first only when the relevant section is not already known.

**Example:**

```bash
vpx @sveltejs/mcp get-documentation '$state,$derived,$effect'
```

### Svelte autofixer

```bash
vpx @sveltejs/mcp svelte-autofixer "<code_or_path>" [options]
```

Analyzes Svelte code and suggests fixes for common issues.

**Options:**

- `--async` enables async Svelte mode. Use it when the owning build enables `compilerOptions.experimental.async`.
- `--svelte-version` accepts a full version, which enables version-specific suggestions. Resolve the installed version from the package that builds the file. The supported major versions are 4 and 5, with 5 as the default.

**Examples:**

```bash
# Analyze inline code with the installed Svelte version
vpx @sveltejs/mcp svelte-autofixer '<script>let count = $state(0);</script>' \
  --svelte-version "$(vp node -p "require('svelte/package.json').version")"
```

Prefer a file path for existing components. Single-quote inline code to keep the shell from expanding runes such as `$state`.

## Workflow

1. **Uncertain about syntax, APIs, or version behavior?** Fetch relevant topics with `get-documentation`; use `list-sections` only when the section is unknown.
2. **Reviewing/debugging?** Use `svelte-autofixer` when it can help investigate a concrete Svelte concern.
3. **Validate logic changes** - Run `svelte-autofixer` before finalizing Svelte logic changes; typo/format-only edits may skip. Reuse the result for unchanged code. Retry a plausibly transient failure once; if clearly unavailable, note the limitation and continue other validation. Fix clear true-positives relevant to the change and re-validate at most twice; do not loop on disputed style hints.

Final project validation follows [AGENTS.md](../../../AGENTS.md).
