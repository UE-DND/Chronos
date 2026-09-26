import { describe, expect, it } from 'vite-plus/test';
import { CookieJar } from './cookie-jar';
import { NodeCqutSession } from './node-cqut-session';

describe('NodeCqutSession', () => {
	it('clears its in-memory cookies on dispose', async () => {
		const jar = new CookieJar();
		jar.setCookie('JSESSIONID=sensitive; Path=/', 'https://timetable-cfc.cqut.edu.cn/');
		const session = new NodeCqutSession(jar);

		expect(await session.hasCookie('https://timetable-cfc.cqut.edu.cn', 'JSESSIONID')).toBe(true);
		await session.dispose();
		expect(await session.hasCookie('https://timetable-cfc.cqut.edu.cn', 'JSESSIONID')).toBe(false);
	});
});
