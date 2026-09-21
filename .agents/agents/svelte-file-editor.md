# Svelte editing

Consult Svelte MCP documentation when syntax, APIs or version behavior are uncertain. Use `list-sections` to locate a topic, then `get-documentation` for the relevant sections. If MCP is unavailable, use the [svelte-code-writer skill](../skills/svelte-code-writer/SKILL.md) for the CLI fallback.

Validate Svelte logic changes with `svelte_autofixer` and address clear findings relevant to the change. Typo and format-only edits can skip it; unchanged code can reuse its result. Retry a plausibly transient failure once, then report tool unavailability and continue other validation. Limit autofixer repair passes to two rather than looping on disputed style hints.

Review the diff and follow [AGENTS.md](../../AGENTS.md) for final validation. Report changes, validation and remaining limitations.
