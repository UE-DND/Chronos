<!--VITE PLUS START-->
<!--VITE PLUS MANAGE CONTENT, DON'T EDIT MANUALLY-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

## Quick Overview

Chronos is a PWA timetable app.

- Stack: TypeScript, Svelte 5, SvelteKit, Tailwind CSS 4
- Data & i18n: Dexie (Client-side), Paraglide (en / zh-cn), PostHog
- Package Manager: Use `vp` / `vpx` CLI only (do not invoke pnpm / npm / yarn / npx directly). `vpx` is the only allowed runner for one-off package binaries (e.g. `vpx @sveltejs/mcp ...`).
- Developer docs: See `CONTRIBUTING.md` at the repository root

## Write Code

For behavior, framework, or architecture changes, use `.agents/skills/tobelazy/SKILL.md` to select relevant guidance. Simple edits need only the local context and a diff review.

Proceed through implementation and applicable validation without waiting for plan approval. Decide reversible implementation details independently and do not reconfirm actions already authorized. Ask only about ambiguities that materially affect acceptance or unauthorized decisions involving data loss, breaking external protocols, or adding dependencies. Continue independent work while awaiting an answer. Declare authorized breaking changes in the final response.

## Response Format

Be concise. Do not write unsolicited "WHY" explanations. Required declarations (breaking changes, root cause, validation results) always override this.

## 未发布阶段的数据契约

Chronos 目前尚未发布，保持自有数据库、数据结构与线格式版本固定为 `1`。直接维护唯一当前结构，不新增升级链、旧格式分支、兼容别名或旧数据补迁移。开发数据失效时手动清空并重新导入，不在启动时自动删除。此约定不改变产品发布号、随宿主发布的插件版本、第三方依赖或外部标准版本。

## Commit Convention

Use Gitmoji format: `<emoji> <concise Chinese>` (no `feat:`/`fix:` prefix). e.g., `✨ 新增课表导出功能`.
Do not commit / push unless explicitly requested; reporting completion ≠ committing.

## Branch, Commit, and PR Contracts

- Keep each commit focused on one logical change and follow the Commit Convention above.
- When a larger change can be split into independently reviewable layers and an upper layer depends on lower-layer work that is not merged yet, prefer stacked pull requests: target the bottom pull request at the trunk and each higher pull request at the immediately preceding branch. Keep unrelated changes in separate pull requests targeting the appropriate trunk; all branches in a stack must belong to the same repository.
- Pull request titles do not need Gitmoji. Use `.github/pull_request_template.md` for descriptions and omit the release-notes section for non-release pull requests.

## Validation

Canonical commands are `vp run check` and `vp run test` (see `CONTRIBUTING.md`; the `vite.config.ts` tasks perform project-specific setup and plugin preparation before running the underlying checks). Run scoped single-file tests during iteration, full suite once at the end; docs-only changes may skip tests with a note. Run `vp install` after cloning, switching branches, pulling dependency changes, or when the installation is stale. On env issues run `vp env doctor`, attempt the obvious fix first, and only ask for help if still blocked.

Skills share these validation results for the same final code state. Rerun affected checks only after further changes, failures, or new evidence. Fix failures caused by the requested change; report unrelated failures without expanding scope. Work is complete when the requested behavior is implemented, applicable validation is complete, and any remaining limitations are reported.
