import { gsap } from 'gsap';
import { isReducedMotionActive } from '@chronos/ui-kit';
import type { TimetableLayoutMode } from '@chronos/core';
import type { LongPressDemoController } from './long-press-demo.svelte';
import { TIMETABLE_LONG_PRESS_DELAY_MS } from '#lib/timetable/timetable-interaction.svelte.ts';

/** Shared lifecycle for the two onboarding demos, scoped to their mounted root. */
export function attachDemoMotion(
	root: HTMLElement,
	create: (root: HTMLElement) => gsap.core.Timeline,
	reset?: (reduced: boolean) => void
) {
	let context: gsap.Context | undefined;
	let timeline: gsap.core.Timeline | undefined;
	const measured = [
		root,
		...root.querySelectorAll<HTMLElement>('.grid-area, .viewport, .grid, .timetable-grid-body')
	];
	const dimensions = () =>
		measured.map((node) => `${node.offsetWidth}:${node.offsetHeight}`).join('|');
	let size = '';
	const media = window.matchMedia('(prefers-reduced-motion: reduce)');
	const testRoot = root as HTMLElement & { __demoTimeline?: gsap.core.Timeline };
	function rebuild() {
		context?.revert();
		timeline = undefined;
		if (__ONBOARDING_TEST__) delete testRoot.__demoTimeline;
		const reduced =
			isReducedMotionActive() || document.documentElement.classList.contains('reduce-motion');
		root.classList.toggle('demo-reduced', reduced);
		reset?.(reduced);
		if (reduced) return;
		context = gsap.context(() => {
			timeline = create(root);
			if (document.hidden) timeline.pause();
			if (__ONBOARDING_TEST__) testRoot.__demoTimeline = timeline;
		}, root);
	}
	function visibility() {
		if (document.hidden) timeline?.pause();
		else timeline?.resume();
	}
	const resize = new ResizeObserver(() => {
		const next = dimensions();
		if (next === size) return;
		size = next;
		rebuild();
	});
	function preferenceChanged() {
		const reduced =
			isReducedMotionActive() || document.documentElement.classList.contains('reduce-motion');
		if (reduced !== root.classList.contains('demo-reduced')) rebuild();
	}
	const preferences = new MutationObserver(preferenceChanged);
	preferences.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	media.addEventListener('change', preferenceChanged);
	document.addEventListener('visibilitychange', visibility);
	for (const node of measured) resize.observe(node);
	size = dimensions();
	rebuild();
	return () => {
		resize.disconnect();
		preferences.disconnect();
		media.removeEventListener('change', preferenceChanged);
		document.removeEventListener('visibilitychange', visibility);
		context?.revert();
		root.classList.remove('demo-reduced');
		if (__ONBOARDING_TEST__) delete testRoot.__demoTimeline;
	};
}

function element(root: HTMLElement, selector: string): HTMLElement {
	const node = root.querySelector<HTMLElement>(selector);
	if (!node) throw new Error(`Missing onboarding element: ${selector}`);
	return node;
}

export function createLongPressTimeline(root: HTMLElement, demo: LongPressDemoController) {
	const touch = element(root, '.touch-indicator');
	const grid = element(root, '.timetable-grid-body');
	const toolbar = element(root, '.demo-toolbar');
	const bounds = root.getBoundingClientRect();
	const gridRect = grid.getBoundingClientRect();
	const columns = demo.state.layout.gridModel.visibleDays.length;
	const rows = demo.state.layout.gridModel.displayedPeriodCount;
	const cell = (day: number, period: number) => ({
		x: gridRect.left - bounds.left + (gridRect.width * (day - 0.5)) / columns,
		y: gridRect.top - bounds.top + (gridRect.height * (period - 0.5)) / rows
	});
	const source = cell(1, 1);
	const target = cell(2, 1);
	const deleteRect = toolbar.getBoundingClientRect();
	const deletion = {
		x: deleteRect.left - bounds.left + deleteRect.width / 2,
		y: deleteRect.top - bounds.top + deleteRect.height / 2
	};
	const pointer = () =>
		new PointerEvent('pointermove', {
			pointerId: -1,
			isPrimary: true,
			clientX: bounds.left + Number(gsap.getProperty(touch, 'x')),
			clientY: bounds.top + Number(gsap.getProperty(touch, 'y'))
		});
	function updateTarget() {
		const event = pointer();
		const overDelete = event.clientY >= deleteRect.top;
		demo.interaction.setDragOverDeleteZone(overDelete);
		if (!overDelete)
			demo.interaction.updateDragFromPointer(event, {
				gridRect,
				visibleDays: demo.state.layout.gridModel.visibleDays,
				displayedPeriodCount: rows
			});
	}
	const tl = gsap.timeline({
		delay: 0.6,
		repeat: -1,
		onRepeat: () => demo.reset(),
		defaults: { duration: 0.2, ease: 'power1.inOut' }
	});
	tl.set(touch, { ...source, opacity: 0, scale: 1.2 })
		.addLabel('press', 0.3)
		.to(touch, { opacity: 1, scale: 0.82 }, 'press')
		.addLabel('held', 0.3 + TIMETABLE_LONG_PRESS_DELAY_MS / 1000)
		.call(() => demo.hold(pointer()), [], 'held')
		.addLabel('edit', 1.4)
		.call(
			() => {
				void demo.release();
			},
			[],
			'edit'
		)
		.to(touch, { opacity: 0 }, 'edit')
		.addLabel('move', 2.4)
		.call(() => demo.beginDrag(pointer()), [], 'move')
		.to(touch, { opacity: 1 }, 'move')
		.to(touch, { ...target, duration: 0.9, onUpdate: updateTarget }, 'move+=0.3')
		.addLabel('land', 3.8)
		.call(
			() => {
				void demo.release();
			},
			[],
			'land'
		)
		.to(touch, { opacity: 0 }, 'land')
		.addLabel('delete', 5)
		.call(() => demo.beginDrag(pointer()), [], 'delete')
		.to(touch, { opacity: 1 }, 'delete')
		.to(touch, { ...deletion, duration: 1.1, onUpdate: updateTarget }, 'delete+=0.3')
		.addLabel('overDelete', 6.4)
		.addLabel('confirm', 7.1)
		.call(
			() => {
				void demo.release();
			},
			[],
			'confirm'
		)
		.to(touch, { opacity: 0 }, 'confirm')
		.addLabel('confirmPress', 9.1)
		.set(
			touch,
			{
				x: () => {
					const rect = element(root, '.confirm-sheet button:last-child').getBoundingClientRect();
					return rect.left - root.getBoundingClientRect().left + rect.width / 2;
				},
				y: () => {
					const rect = element(root, '.confirm-sheet button:last-child').getBoundingClientRect();
					return rect.top - root.getBoundingClientRect().top + rect.height / 2;
				}
			},
			'confirmPress'
		)
		.to(touch, { opacity: 1 }, 'confirmPress')
		.addLabel('deleted', 9.6)
		.call(() => demo.confirmDelete(), [], 'deleted')
		.to(touch, { opacity: 0 }, 'deleted')
		.to({}, { duration: 1.5 });
	return tl;
}

export function createLayoutTimeline(root: HTMLElement, mode: TimetableLayoutMode) {
	const grid = element(root, '.grid');
	const viewport = element(root, '.viewport');
	const courses = root.querySelectorAll<HTMLElement>('.course');
	const distance = Math.max(
		0,
		grid.getBoundingClientRect().bottom - viewport.getBoundingClientRect().bottom
	);
	const tl = gsap.timeline({ repeat: -1 });
	if (mode === 'fixed') {
		tl.set(grid, { y: 0 })
			.to(grid, { y: -distance, duration: 0.96, ease: 'power1.inOut' }, 0.3)
			.to(grid, { y: 0, duration: 0.96, ease: 'power1.inOut' }, 1.74);
	}
	tl.fromTo(
		courses,
		{ filter: 'brightness(1)' },
		{
			filter: 'brightness(1.14)',
			duration: 1.5,
			ease: 'sine.inOut',
			repeat: 1,
			yoyo: true
		},
		0
	);
	return tl;
}
