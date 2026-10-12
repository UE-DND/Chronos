import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { createStartupController } from './startup.svelte';

afterEach(() => vi.useRealTimers());

describe('startup readiness', () => {
	it('bounds core startup and never accepts a late completion', async () => {
		vi.useFakeTimers();
		const report = vi.fn();
		const boot = createStartupController(report);
		let finish!: () => void;
		const pending = boot.prepareCore(
			() =>
				new Promise<void>((resolve) => {
					finish = resolve;
				})
		);
		const rejected = expect(pending).rejects.toThrow('core');
		await vi.advanceTimersByTimeAsync(25_000);
		await rejected;
		finish();
		await Promise.resolve();
		expect(boot.state.core).toBe('failed');
		expect(report).toHaveBeenCalledOnce();
	});

	it('shares a failed plugin attempt and allows explicit timetable fallback only after core readiness', async () => {
		vi.useFakeTimers();
		const boot = createStartupController(vi.fn());
		expect(boot.enterTimetable()).toBe(false);
		await boot.prepareCore(async () => {});
		const work = vi.fn(() => new Promise<void>(() => {}));
		const pending = boot.restorePlugins(work);
		const rejected = expect(pending).rejects.toThrow('plugins');
		await vi.advanceTimersByTimeAsync(10_000);
		await rejected;
		expect(boot.restorePlugins(work)).toBe(pending);
		expect(work).toHaveBeenCalledOnce();
		expect(boot.enterTimetable()).toBe(true);
		expect(boot.state.timetableFallback).toBe(true);
	});

	it('propagates initialization failure instead of reporting full readiness', async () => {
		const boot = createStartupController(vi.fn());
		await boot.prepareCore(async () => {});
		await expect(
			boot.restorePlugins(async () => {
				throw new Error('plugin failed');
			})
		).rejects.toThrow('plugin failed');
		expect(boot.state.plugins).toBe('failed');
		expect(boot.state.failure?.stage).toBe('plugins');
	});

	it('does not make disposed startup work ready in a new session', async () => {
		const boot = createStartupController(vi.fn());
		let finish!: () => void;
		const pending = boot.prepareCore(
			() =>
				new Promise<void>((resolve) => {
					finish = resolve;
				})
		);
		await Promise.resolve();
		boot.reset();
		finish();
		await expect(pending).rejects.toThrow('disposed');
		expect(boot.state.core).toBe('pending');
	});
});
