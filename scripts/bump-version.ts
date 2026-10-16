import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export type BumpType = 'patch' | 'minor' | 'major';
export type TargetVersion = BumpType | (string & {});

export function computeNextVersion(current: string, target: TargetVersion): string {
	const match = current.match(semverRegex);
	if (!match) throw new Error(`Invalid current version: ${current}`);
	const [, major, minor, patch] = match.map(Number);

	if (target === 'patch') {
		return `${major}.${minor}.${patch + 1}`;
	}
	if (target === 'minor') {
		return `${major}.${minor + 1}.0`;
	}
	if (target === 'major') {
		return `${major + 1}.0.0`;
	}

	const cleanTarget = target.startsWith('v') ? target.slice(1) : target;
	if (!semverRegex.test(cleanTarget)) {
		throw new Error(
			`Target version must be patch, minor, major or a valid SemVer (X.Y.Z), got: ${target}`
		);
	}
	return cleanTarget;
}

export function updatePackageJsonVersion(filePath: string, newVersion: string): void {
	const content = readFileSync(filePath, 'utf8');
	const parsed = JSON.parse(content) as { version?: string };
	parsed.version = newVersion;
	writeFileSync(filePath, JSON.stringify(parsed, null, '\t') + '\n');
}

export function scaffoldReleaseEntry(root: string, newVersion: string): string {
	const entryPath = resolve(root, `apps/web/src/lib/content/releases/entries/v${newVersion}.md`);
	if (existsSync(entryPath)) {
		return entryPath;
	}
	const today = new Date().toISOString().split('T')[0];
	const template = `---
name: Chronos ${newVersion}
publishedAt: ${today}
---

## 新特性

- 

## 修复

- 
`;
	writeFileSync(entryPath, template);
	return entryPath;
}

export function bumpProjectVersion(
	root: string,
	target: TargetVersion
): { previous: string; next: string } {
	const webPkgPath = resolve(root, 'apps/web/package.json');
	const currentVersion = (JSON.parse(readFileSync(webPkgPath, 'utf8')) as { version: string })
		.version;
	const nextVersion = computeNextVersion(currentVersion, target);

	const targets = [
		resolve(root, 'package.json'),
		resolve(root, 'apps/web/package.json'),
		resolve(root, 'apps/mobile/package.json')
	];

	for (const pkg of targets) {
		updatePackageJsonVersion(pkg, nextVersion);
	}

	scaffoldReleaseEntry(root, nextVersion);

	return { previous: currentVersion, next: nextVersion };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const args = process.argv.slice(2).filter((arg) => arg !== '--');
	const target = args[0];
	if (!target || target === '--help' || target === '-h') {
		console.log(
			'用法: vp run version:bump -- <patch|minor|major|X.Y.Z>\n\n自动同步 monorepo 内所有 package.json 版本，并准备发行说明条目。'
		);
		process.exit(target ? 0 : 1);
	}
	const { previous, next } = bumpProjectVersion(process.cwd(), target);
	console.log(`✨ 已将项目版本从 v${previous} 升级至 v${next}`);
	console.log(`- 已同步更新 package.json、apps/web/package.json、apps/mobile/package.json`);
	console.log(`- 已准备发行说明文件: apps/web/src/lib/content/releases/entries/v${next}.md`);
	console.log(`请编辑发行说明内容后，运行 vp run release:check 校验。`);
}
