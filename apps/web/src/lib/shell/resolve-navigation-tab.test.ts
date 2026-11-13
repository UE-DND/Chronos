import { describe, expect, it } from 'vite-plus/test';
import type {
	BottomTabSlotContribution,
	PluginScreenSlotContribution,
	StandardSlotMap
} from '@chronos/core';
import { getNavigableTabs, resolveTodayTab } from './resolve-navigation-tab';

function controller(
	tabs: BottomTabSlotContribution[],
	screens: PluginScreenSlotContribution[] = [],
	owners: Record<string, string> = {},
	running = new Set(Object.values(owners))
) {
	const slots: { [K in 'shell.bottom-bar.tab' | 'shell.route.screen']: StandardSlotMap[K][] } = {
		'shell.bottom-bar.tab': tabs,
		'shell.route.screen': screens
	};
	function getSlots<K extends keyof typeof slots>(slot: K) {
		return slots[slot];
	}
	return {
		getSlots,
		resolveSlotOwner: (slot: string, id: string) =>
			owners[`${slot}/${id}`] ??
			(slot === 'shell.bottom-bar.tab' && tabs.find((tab) => tab.id === id)?.hostPanel
				? 'host.shell'
				: undefined),
		getPluginContext: (id: string) => {
			if (!running.has(id)) throw new Error('Plugin is not running');
			return {};
		}
	};
}
const tab = (
	id: string,
	extra: Partial<BottomTabSlotContribution> = {}
): BottomTabSlotContribution => ({ id, label: id, ...extra });
const screen = (id: string): PluginScreenSlotContribution => ({ id, title: id, schema: {} });

describe('Today navigation intent', () => {
	it('accepts arbitrary IDs and preserves provider order', () => {
		const source = controller(
			[
				tab('custom', { navigationIntent: 'today' }),
				tab('second', { navigationIntent: 'today' }),
				tab('schedule', { hostPanel: 'timetable' })
			],
			[screen('one'), screen('two')],
			{
				'shell.bottom-bar.tab/custom': 'one',
				'shell.route.screen/one': 'one',
				'shell.bottom-bar.tab/second': 'two',
				'shell.route.screen/two': 'two'
			}
		);
		expect(resolveTodayTab(source)?.id).toBe('custom');
	});

	it('rejects absent pages, mismatched owners and stopped owners', () => {
		const source = controller(
			[
				tab('pretend-host', { hostPanel: 'timetable', navigationIntent: 'today' }),
				tab('missing', { navigationIntent: 'today' }),
				tab('wrong', { navigationIntent: 'today' }),
				tab('stopped', { navigationIntent: 'today' }),
				tab('broken', { navigationIntent: 'today' }),
				tab('schedule', { hostPanel: 'timetable' })
			],
			[screen('two'), screen('three'), Object.assign(screen('four'), { component: {} })],
			{
				'shell.bottom-bar.tab/pretend-host': 'plugin',
				'shell.bottom-bar.tab/missing': 'one',
				'shell.bottom-bar.tab/wrong': 'two',
				'shell.route.screen/two': 'other',
				'shell.bottom-bar.tab/stopped': 'three',
				'shell.route.screen/three': 'three',
				'shell.bottom-bar.tab/broken': 'four',
				'shell.route.screen/four': 'four'
			},
			new Set(['one', 'two', 'other', 'four'])
		);
		expect(getNavigableTabs(source).map(({ id }) => id)).toEqual(['schedule']);
		expect(resolveTodayTab(source)?.id).toBe('schedule');
	});

	it('falls back through timetable, default launch, first valid tab and no target', () => {
		const valid = [
			tab('first', { hostPanel: 'mine' }),
			tab('default', { hostPanel: 'mine', defaultLaunch: true })
		];
		expect(
			resolveTodayTab(controller([...valid, tab('schedule', { hostPanel: 'timetable' })]))?.id
		).toBe('schedule');
		expect(resolveTodayTab(controller(valid))?.id).toBe('default');
		expect(resolveTodayTab(controller([valid[0]!]))?.id).toBe('first');
		expect(resolveTodayTab(controller([]))).toBeUndefined();
	});

	it('stops selecting an intent immediately after its contribution is removed', () => {
		const tabs = [
			tab('intent', { navigationIntent: 'today' }),
			tab('schedule', { hostPanel: 'timetable' })
		];
		const source = controller(tabs, [screen('one')], {
			'shell.bottom-bar.tab/intent': 'one',
			'shell.route.screen/one': 'one'
		});
		expect(resolveTodayTab(source)?.id).toBe('intent');
		tabs.shift();
		expect(resolveTodayTab(source)?.id).toBe('schedule');
	});
});
