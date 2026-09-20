import { describe, expect, it } from 'vite-plus/test';
import { ChronosDB } from './db';

describe('ChronosDB schema', () => {
	it('defines version 1 with pluginBinary store', () => {
		const db = new ChronosDB();
		expect(db.verno).toBe(1);
		expect(db.tables.map((table) => table.name).sort()).toEqual([
			'courses',
			'images',
			'pluginBinary',
			'pluginData',
			'timetables'
		]);
	});
});
