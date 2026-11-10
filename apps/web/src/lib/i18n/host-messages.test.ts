import { describe, expect, it } from 'vite-plus/test';
import { en, zhCn } from './host-messages';

describe('host-messages', () => {
	it('keeps zh-cn and en keys in parity', () => {
		expect(Object.keys(en).sort()).toEqual(Object.keys(zhCn).sort());
	});
});
