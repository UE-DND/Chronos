import { describe, expect, it } from 'vite-plus/test';
import {
	ImportSlotError,
	isImportSlotError,
	resolveDefaultLaunchTab,
	resolveHostPanelTab,
	type BottomTabSlotContribution
} from '../src/types/slots';
import { ImportSlotError as PluginImportSlotError } from './fixtures/plugin-import-slot-error';

describe('plugin import error contract', () => {
	it.each(['no-data', 'invalid-data', 'network', 'unsupported', 'unknown'])(
		'recognizes a separate bundle class with kind %s',
		(kind) => {
			const error = new PluginImportSlotError(kind, 'Known plugin import failure');
			expect(error).not.toBeInstanceOf(ImportSlotError);
			expect(isImportSlotError(error)).toBe(true);
		}
	);
	it.each([
		new Error('Unexpected failure'),
		Object.assign(new Error('Unexpected failure'), { kind: 'network' }),
		{ kind: 'network' },
		{ kind: 'network', message: 'Missing name' },
		{ name: 'ImportSlotError', kind: 'network', message: 42 },
		new PluginImportSlotError('invalid-kind', 'Unknown failure'),
		null
	])('rejects incomplete or unrelated error metadata: %s', (value) => {
		expect(isImportSlotError(value)).toBe(false);
	});
});

function tab(
	overrides: Partial<BottomTabSlotContribution> & Pick<BottomTabSlotContribution, 'id'>
): BottomTabSlotContribution {
	return {
		label: overrides.id,
		...overrides
	};
}

describe('resolveHostPanelTab', () => {
	it('returns the tab that declares the requested host panel', () => {
		const timetable = tab({ id: 'timetable', order: 10, hostPanel: 'timetable' });
		const mine = tab({ id: 'mine', order: 20, hostPanel: 'mine' });
		expect(resolveHostPanelTab([timetable, mine], 'timetable')).toBe(timetable);
		expect(resolveHostPanelTab([timetable, mine], 'mine')).toBe(mine);
	});

	it('returns undefined when no tab declares the panel', () => {
		expect(resolveHostPanelTab([tab({ id: 'today', order: 15 })], 'timetable')).toBeUndefined();
	});
});

describe('resolveDefaultLaunchTab', () => {
	it('returns undefined when no tab declares defaultLaunch', () => {
		expect(
			resolveDefaultLaunchTab([tab({ id: 'timetable', order: 10 }), tab({ id: 'mine', order: 20 })])
		).toBeUndefined();
	});

	it('returns the first tab with defaultLaunch in registry order', () => {
		const today = tab({ id: 'today', order: 15, defaultLaunch: true });
		expect(
			resolveDefaultLaunchTab([
				tab({ id: 'timetable', order: 10 }),
				today,
				tab({ id: 'mine', order: 20 })
			])
		).toBe(today);
	});

	it('returns the first defaultLaunch tab when multiple declare it', () => {
		const earlier = tab({ id: 'today', order: 15, defaultLaunch: true });
		const later = tab({ id: 'other', order: 25, defaultLaunch: true });
		expect(resolveDefaultLaunchTab([earlier, later])).toBe(earlier);
		expect(resolveDefaultLaunchTab([later, earlier])).toBe(later);
	});
});
