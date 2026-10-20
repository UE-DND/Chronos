import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, expect, it } from 'vite-plus/test';
import type { HostBuildIdentity } from '../../../../packages/core/src/types/host-update.ts';
import { finalizeWorkerArtifacts } from './worker-artifacts.ts';

let output: string | undefined;

afterEach(() => {
	if (output) rmSync(output, { recursive: true, force: true });
	output = undefined;
});

it('keeps a null preparation lock active in the generated worker', () => {
	output = mkdtempSync(resolve(tmpdir(), 'chronos-worker-'));
	const host: HostBuildIdentity = {
		version: '1.0.0',
		buildId: 'a'.repeat(64),
		sourceCommit: 'b'.repeat(40),
		profileId: 'chronos-default',
		deploymentId: 'pages',
		target: 'pages'
	};
	mkdirSync(resolve(output, '_app'), { recursive: true });
	mkdirSync(resolve(output, `_chronos/${host.buildId}`), { recursive: true });
	writeFileSync(resolve(output, `_chronos/${host.buildId}/shell.html`), '');
	writeFileSync(resolve(output, '_app/env.js'), '');
	writeFileSync(resolve(output, 'sw.js'), '');

	finalizeWorkerArtifacts(output, host, '');

	const source = readFileSync(resolve(output, `sw-host-gate-${host.buildId}.js`), 'utf8');
	expect(source).toContain('prepared.until === null || prepared.until > Date.now()');
});
