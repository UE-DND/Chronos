import { describe, expect, it, vi, afterEach } from 'vite-plus/test';
import type { ImageRepository } from '#lib/storage/image-repository.ts';
import { createWallpaperController } from './wallpaper-controller.svelte';
import { tick } from 'svelte';

afterEach(() => vi.unstubAllGlobals());
describe('host wallpaper controller', () => {
	function setup() {
		let notify: (blob: Blob | null) => void = () => {};
		const put = vi.fn().mockResolvedValue(undefined);
		const remove = vi.fn().mockResolvedValue(undefined);
		const unsubscribe = vi.fn();
		const images = {
			put,
			delete: remove,
			watchCustom: (fn: typeof notify) => {
				notify = fn;
				return { unsubscribe };
			}
		};
		const controller = createWallpaperController(images as unknown as ImageRepository);
		const created: Blob[] = [];
		const revoke = vi.fn();
		vi.stubGlobal('URL', {
			createObjectURL: (blob: Blob) => {
				created.push(blob);
				return `blob:${created.length}`;
			},
			revokeObjectURL: revoke
		});
		controller.init(vi.fn());
		return {
			controller,
			put,
			remove,
			unsubscribe,
			revoke,
			created,
			notify: (blob: Blob | null) => notify(blob),
			getNotifier: () => notify
		};
	}
	it('keeps saved user images when switching themes, and observes changes from other tabs', async () => {
		const { controller, created, notify, revoke, unsubscribe } = setup();
		const custom = new Blob(['user']);
		const first = new Blob(['theme-a']);
		const second = new Blob(['theme-b']);
		notify(custom);
		controller.select('custom', first);
		expect(controller.state.uri).toBe('blob:1');
		controller.select('custom', second);
		expect(created).toEqual([custom]);
		controller.select('theme', second);
		expect(created).toEqual([custom, second]);
		await tick();
		expect(revoke).toHaveBeenCalledWith('blob:1');
		controller.select('none', second);
		expect(controller.state.hasCustom).toBe(true);
		controller.select('custom');
		notify(null);
		expect(controller.state.uri).toBeNull();
		controller.destroy();
		expect(unsubscribe).toHaveBeenCalledOnce();
	});
	it('does not replace visible state on failed save or deletion', async () => {
		const { controller, notify, put, remove } = setup();
		controller.select('custom');
		notify(new Blob(['saved']));
		put.mockRejectedValueOnce(new Error('quota'));
		remove.mockRejectedValueOnce(new Error('storage'));
		await expect(controller.save(new Blob(['new']))).rejects.toThrow('quota');
		await expect(controller.clear()).rejects.toThrow('storage');
		expect(controller.state.uri).toBe('blob:1');
		expect(controller.state.hasCustom).toBe(true);
		controller.destroy();
	});
	it('does not recreate an object URL when a save completes after destruction', async () => {
		const { controller, put, created } = setup();
		let finish!: () => void;
		put.mockImplementationOnce(
			() =>
				new Promise<void>((resolve) => {
					finish = resolve;
				})
		);
		controller.select('custom');
		const saving = controller.save(new Blob(['pending']));
		controller.destroy();
		finish();
		await saving;
		expect(created).toHaveLength(0);
		expect(controller.state.uri).toBeNull();
	});
	it.each(['before', 'after'] as const)(
		'publishes only the subscribed Blob when subscription arrives %s write completion',
		async (order) => {
			const { controller, put, created, notify } = setup();
			controller.select('custom');
			const input = new Blob(['new']);
			const stored = new Blob(['new']);
			let finish!: () => void;
			put.mockImplementationOnce(
				() =>
					new Promise<void>((resolve) => {
						finish = resolve;
					})
			);
			const saving = controller.save(input);
			if (order === 'before') notify(stored);
			finish();
			await saving;
			if (order === 'after') {
				expect(controller.state.uri).toBeNull();
				notify(stored);
			}
			expect(created).toEqual([stored]);
			expect(controller.state.uri).toBe('blob:1');
			controller.destroy();
		}
	);
	it('clears only on subscription and rejects stale callbacks after reinitialization', async () => {
		const { controller, notify, getNotifier, created } = setup();
		controller.select('custom');
		notify(new Blob(['saved']));
		await controller.clear();
		expect(controller.state.hasCustom).toBe(true);
		notify(null);
		expect(controller.state.uri).toBeNull();
		const stale = getNotifier();
		controller.destroy();
		controller.init(vi.fn());
		stale(new Blob(['stale']));
		expect(controller.state.hasCustom).toBe(false);
		expect(created).toHaveLength(1);
		notify(new Blob(['external']));
		expect(controller.state.uri).toBe('blob:2');
		controller.destroy();
	});
});
