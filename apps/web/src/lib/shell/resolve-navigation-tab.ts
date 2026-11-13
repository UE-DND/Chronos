import {
	isChronosMountable,
	resolveDefaultLaunchTab,
	resolveHostPanelTab,
	type BottomTabSlotContribution,
	type StandardSlotMap
} from '@chronos/core';
import { resolvePluginScreenSlot } from '@chronos/ui-kit';

interface NavigationContributions {
	getSlots<K extends 'shell.bottom-bar.tab' | 'shell.route.screen'>(slot: K): StandardSlotMap[K][];
	resolveSlotOwner(
		slot: 'shell.bottom-bar.tab' | 'shell.route.screen',
		id: string
	): string | undefined;
	getPluginContext(id: string): unknown;
}

/** Plugin tabs navigate only to the current owner's mountable default page. */
export function getNavigableTabs(controller: NavigationContributions): BottomTabSlotContribution[] {
	const screens = controller.getSlots('shell.route.screen');
	return controller.getSlots('shell.bottom-bar.tab').filter((tab) => {
		const owner = controller.resolveSlotOwner('shell.bottom-bar.tab', tab.id);
		if (tab.hostPanel) return owner === 'host.shell';
		if (!owner) return false;
		try {
			if (!controller.getPluginContext(owner)) return false;
		} catch {
			return false;
		}
		const screen = resolvePluginScreenSlot(screens, owner, 'index', (id) =>
			controller.resolveSlotOwner('shell.route.screen', id)
		);
		return screen?.component ? isChronosMountable(screen.component) : Boolean(screen?.schema);
	});
}

export function resolveTodayTab(
	controller: NavigationContributions
): BottomTabSlotContribution | undefined {
	const tabs = getNavigableTabs(controller);
	return (
		tabs.find((tab) => tab.navigationIntent === 'today') ??
		resolveHostPanelTab(tabs, 'timetable') ??
		resolveDefaultLaunchTab(tabs) ??
		tabs[0]
	);
}
