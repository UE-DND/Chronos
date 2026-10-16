import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import timetable from '../../packages/core/tests/fixtures/timetable.json';

const root = fileURLToPath(new URL('../..', import.meta.url));
const output = resolve(root, 'dist/e2e');
mkdirSync(output, { recursive: true });
for (const build of ['old', 'new', 'isolated']) {
	execFileSync('vp', ['run', 'build:pages'], {
		cwd: root,
		stdio: 'inherit',
		env: {
			...process.env,
			PUBLIC_REGRESSION_BUILD: build,
			CHRONOS_BASE_PATH: build === 'isolated' ? '/Other' : '/Chronos',
			PUBLIC_FIREBASE_API_KEY: '',
			PUBLIC_FIREBASE_APP_ID: '',
			PUBLIC_FIREBASE_AUTH_DOMAIN: '',
			PUBLIC_FIREBASE_MEASUREMENT_ID: '',
			PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '',
			PUBLIC_FIREBASE_PROJECT_ID: '',
			PUBLIC_FIREBASE_STORAGE_BUCKET: ''
		}
	});
	rmSync(resolve(output, build), { recursive: true, force: true });
	cpSync(resolve(root, 'apps/web/build'), resolve(output, build), { recursive: true });
	cpSync(resolve(root, 'dist/plugin-market'), resolve(output, build, 'market'), {
		recursive: true
	});
}
writeFileSync(resolve(output, 'scenario.payload'), await encodeSharePayload(timetable));
