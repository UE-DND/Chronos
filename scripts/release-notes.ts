import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {
	assertReleaseContent,
	compareReleaseVersions,
	parseFrontmatter
} from '../apps/web/src/lib/content/releases/release.ts';
import { resolveProfile } from '../apps/web/src/lib/profile-codegen/profile-definitions.ts';
import type { AndroidStableUpdate } from '../packages/core/src/types/host-update.ts';

const stableTag = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function previousReleaseTag(tags: string[], target: string): string | undefined {
	return tags
		.filter((tag) => stableTag.test(tag) && compareReleaseVersions(tag, target) < 0)
		.sort((a, b) => compareReleaseVersions(b, a))[0];
}

/** GitHub-only distribution details never enter version.json or the in-app feed. */
export function renderGitHubReleaseNotes(
	release: AndroidStableUpdate,
	repository: string,
	previous?: string
): string {
	const base = `https://github.com/${repository}`;
	const downloads = Object.entries(release.profiles).map(([id, entry]) => {
		const profile = resolveProfile(id);
		return `| [${profile.name}](${entry.apkUrl}) | ${profile.description ?? ''} |`;
	});
	return [
		release.release.body.trim(),
		'## 下载与安装',
		'选择适合自己的 Android 发行版。已安装用户请继续使用原发行版，可在应用内检查更新。',
		'| 发行版 | 适用场景 |\n| --- | --- |\n' + downloads.join('\n'),
		'Assets 中的 JSON 文件用于更新校验，无需手动安装。',
		previous
			? `[完整变更：${previous} → ${release.release.tagName}](${base}/compare/${previous}...${release.release.tagName})`
			: `[源码与提交记录](${base}/commits/${release.release.tagName})`,
		''
	].join('\n\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const cliArgs = process.argv.slice(2);
	// vp run forwards the script argument separator unchanged.
	if (cliArgs[1] === '--') cliArgs.splice(1, 1);
	const { values, positionals } = parseArgs({
		args: cliArgs,
		allowPositionals: true,
		options: {
			version: { type: 'string' }
		}
	});
	const cwd = process.cwd();
	const version =
		values.version ??
		(JSON.parse(readFileSync(resolve(cwd, 'apps/web/package.json'), 'utf8')) as { version: string })
			.version;
	if (!stableTag.test(`v${version}`)) throw new Error('Expected version X.Y.Z');
	if (positionals.length !== 1 || positionals[0] !== 'check')
		throw new Error('Usage: release-notes.ts check [--version X.Y.Z]');
	const raw = readFileSync(
		resolve(cwd, `apps/web/src/lib/content/releases/entries/v${version}.md`),
		'utf8'
	);
	const entry = parseFrontmatter(raw);
	assertReleaseContent({
		tagName: `v${version}`,
		name: entry.name ?? '',
		publishedAt: entry.publishedAt ?? '',
		body: entry.body
	});
	console.log(`v${version} 发布说明校验通过`);
}
