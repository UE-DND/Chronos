import { describe, expect, it } from 'vite-plus/test';
import {
	computeNextVersion,
	updateIosProjectVersion,
	updatePackageJsonVersion
} from './bump-version.ts';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { iosBuildNumber } from './versioning.ts';

describe('computeNextVersion', () => {
	it('increments patch version', () => {
		expect(computeNextVersion('1.2.10', 'patch')).toBe('1.2.11');
		expect(computeNextVersion('0.1.0', 'patch')).toBe('0.1.1');
	});

	it('increments minor version', () => {
		expect(computeNextVersion('1.2.10', 'minor')).toBe('1.3.0');
	});

	it('increments major version', () => {
		expect(computeNextVersion('1.2.10', 'major')).toBe('2.0.0');
	});

	it('accepts explicit semver string or v-prefixed string', () => {
		expect(computeNextVersion('1.2.10', '1.2.15')).toBe('1.2.15');
		expect(computeNextVersion('1.2.10', 'v1.3.0')).toBe('1.3.0');
	});

	it('rejects invalid inputs', () => {
		expect(() => computeNextVersion('invalid', 'patch')).toThrow('Invalid current version');
		expect(() => computeNextVersion('1.2.10', 'foo')).toThrow('Target version must be');
		expect(() => computeNextVersion('1.2.10', '1.2')).toThrow('Target version must be');
	});
});

describe('updatePackageJsonVersion', () => {
	it('updates version and preserves tab indentation', () => {
		const tempDir = mkdtempSync(resolve(tmpdir(), 'bump-test-'));
		const pkgPath = resolve(tempDir, 'package.json');
		try {
			writeFileSync(pkgPath, '{\n\t"name": "test",\n\t"version": "1.0.0"\n}\n');
			updatePackageJsonVersion(pkgPath, '1.0.1');
			const content = readFileSync(pkgPath, 'utf8');
			expect(JSON.parse(content).version).toBe('1.0.1');
			expect(content).toContain('\t"version": "1.0.1"');
		} finally {
			rmSync(tempDir, { recursive: true, force: true });
		}
	});
});

describe('iOS version synchronization', () => {
	it('derives a monotonic build number from the release version', () => {
		expect(iosBuildNumber('1.2.11')).toBe('1002011');
		expect(iosBuildNumber('2.0.0')).toBe('2000000');
		expect(() => iosBuildNumber('1.2')).toThrow('stable version');
	});

	it('updates every target build configuration in the Xcode project', () => {
		const tempDir = mkdtempSync(resolve(tmpdir(), 'bump-ios-test-'));
		const project = resolve(tempDir, 'project.pbxproj');
		try {
			writeFileSync(
				project,
				[
					'/* Debug */',
					'CURRENT_PROJECT_VERSION = 1;',
					'MARKETING_VERSION = 1.0.0;',
					'/* Release */',
					'CURRENT_PROJECT_VERSION = 1;',
					'MARKETING_VERSION = 1.0.0;',
					''
				].join('\n')
			);
			updateIosProjectVersion(project, '1.2.11');
			const content = readFileSync(project, 'utf8');
			expect(content.match(/CURRENT_PROJECT_VERSION = 1002011;/g)).toHaveLength(2);
			expect(content.match(/MARKETING_VERSION = 1\.2\.11;/g)).toHaveLength(2);
		} finally {
			rmSync(tempDir, { recursive: true, force: true });
		}
	});
});
