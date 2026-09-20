import { describe, it, expect } from 'vite-plus/test';
import { ChronosEngine, createCourse, createTimetable } from '@chronos/core';
import { createMockEnv } from '@chronos/core/test-utils';
import { shareCodecPlugin } from '../src/index';

describe('shareCodecPlugin', () => {
	const sampleTimetable = createTimetable({
		id: 't1',
		name: '计算机课表',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 20,
			periodTimes: []
		},
		courses: [
			createCourse({
				id: 'c1',
				name: '操作系统',
				teacher: '周老师',
				location: '计科楼402',
				dayOfWeek: 2,
				startPeriod: 3,
				endPeriod: 4,
				weeks: [1, 2, 3]
			})
		]
	});

	it('loads plugin and registers import.source.tab and export.action slots', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.init();

		const handle = await engine.loadPlugin(shareCodecPlugin);

		const sourceSlot = engine.slots.getSlotItem('import.source.tab', 'share-link');
		expect(sourceSlot).toBeDefined();
		expect(engine.slots.getSlotItem('import.source.tab', 'share-json')).toBeUndefined();

		const exportSlot = engine.slots.getSlotItem('export.action', 'share-link');
		expect(exportSlot).toBeDefined();
		expect(engine.slots.getSlotItem('export.action', 'share-json')).toBeUndefined();

		const ctx = engine.getPluginContext('codec-share');
		const exported = await exportSlot!.export(sampleTimetable, ctx);
		expect(exported.filename).toBe('share-token.txt');
		expect(exported.mimeType).toBe('text/plain');
		expect(exported.content).toMatch(/^1\./);

		const imported = await sourceSlot!.executeImport({ content: exported.content as string }, ctx);
		expect(imported.name).toBe('计算机课表');
		expect(imported.courses.length).toBe(1);
		expect(imported.courses[0]?.name).toBe('操作系统');

		handle.dispose();
		expect(engine.slots.getSlotItem('import.source.tab', 'share-link')).toBeUndefined();
		expect(engine.slots.getSlotItem('export.action', 'share-link')).toBeUndefined();
	});
});

it.each([
	null,
	'https://chronos.test/s',
	'https://chronos.test/Chronos/s',
	'https://custom.test/import?via=app'
])('exports through the host link capability: %s', async (url) => {
	const { env } = createMockEnv();
	const engine = new ChronosEngine({ env: { ...env, hostLinks: { getImportUrl: () => url } } });
	await engine.loadPlugin(shareCodecPlugin);
	const timetable = createTimetable({
		id: 'round-trip',
		name: 'round trip',
		courses: [
			createCourse({
				id: 'course',
				name: 'Math',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 1,
				weeks: [1]
			})
		]
	});
	const slot = engine.slots.getSlotItem('export.action', 'share-link')!;
	const result = await slot.export(timetable);
	if (url) expect(result.content).toContain(url + '#1.');
	else expect(result.content).toMatch(/^1\./);
	const source = engine.slots.getSlotItem('import.source.tab', 'share-link')!;
	const imported = await source.executeImport({ content: result.content });
	expect(imported.name).toBe(timetable.name);
	engine.dispose();
});
