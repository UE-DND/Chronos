import { describe, expect, it, vi } from 'vite-plus/test';
import { CHRONOS_MOUNTABLE } from '@chronos/core';
import { createMountableController } from '../src/plugin-screen/mountable-controller.svelte';

function target() {
	return { replaceChildren: vi.fn() } as unknown as HTMLElement;
}

describe('plugin screen failure boundary', () => {
	it('releases asynchronous failures and ignores callbacks from a previous mount', () => {
		const failures: ((error: unknown) => void)[] = [];
		const unmount = vi.fn();
		const component = {
			[CHRONOS_MOUNTABLE]: true,
			mount(_target: HTMLElement, _props: object, lifecycle: { onError(error: unknown): void }) {
				failures.push((error) => lifecycle.onError(error));
				return { unmount };
			}
		};
		const screen = createMountableController(vi.fn());
		screen.mount(component, target(), {});
		failures[0]!(new Error('render failed'));
		expect(screen.state.phase).toBe('failed');
		expect(unmount).toHaveBeenCalledOnce();
		screen.retry({});
		failures[0]!(new Error('late'));
		expect(screen.state.phase).toBe('mounted');
		expect(unmount).toHaveBeenCalledOnce();
		screen.dispose();
	});
	it('rejects an invalid mount handle and cleans up the instance it returned', () => {
		const report = vi.fn();
		const unmount = vi.fn();
		const screen = createMountableController(report);
		screen.mount(
			{ [CHRONOS_MOUNTABLE]: true, mount: () => ({ unmount, update: 42 }) },
			target(),
			{}
		);
		expect(screen.state.phase).toBe('failed');
		expect(unmount).toHaveBeenCalledTimes(1);
		expect(report).toHaveBeenCalledWith('mount', expect.any(Error));
	});
	it('reports mount failure, clears partial output, and only remounts on explicit retry', () => {
		const error = new TypeError('Mount failed');
		const report = vi.fn();
		const unmount = vi.fn();
		const mount = vi
			.fn()
			.mockImplementationOnce(() => {
				throw error;
			})
			.mockReturnValue({ unmount });
		const component = { [CHRONOS_MOUNTABLE]: true as const, mount };
		const element = target();
		const clear = vi.spyOn(element, 'replaceChildren');
		const screen = createMountableController(report);
		screen.mount(component, element, { value: 1 });
		expect(screen.state).toEqual({ phase: 'failed', error });
		expect(clear).toHaveBeenCalled();
		expect(report).toHaveBeenCalledWith('mount', error);
		screen.update({ value: 2 });
		expect(mount).toHaveBeenCalledTimes(1);
		screen.retry({ value: 3 });
		expect(mount).toHaveBeenLastCalledWith(
			element,
			{ value: 3 },
			expect.objectContaining({ onError: expect.any(Function) })
		);
		expect(screen.state).toEqual({ phase: 'mounted', error: null });
		screen.dispose();
		expect(unmount).toHaveBeenCalledTimes(1);
	});
	it('stops and cleans up a failed update even when unmount also fails', () => {
		const error = new Error('Update failed');
		const cleanupError = new Error('Cleanup failed');
		const report = vi.fn();
		const update = vi.fn(() => {
			throw error;
		});
		const unmount = vi.fn(() => {
			throw cleanupError;
		});
		const component = { [CHRONOS_MOUNTABLE]: true as const, mount: () => ({ update, unmount }) };
		const element = target();
		const clear = vi.spyOn(element, 'replaceChildren');
		const screen = createMountableController(report);
		screen.mount(component, element, {});
		screen.update({ active: false });
		expect(screen.state).toEqual({ phase: 'failed', error });
		expect(report).toHaveBeenCalledWith('update', error);
		expect(report).toHaveBeenCalledWith('unmount', cleanupError);
		expect(clear).toHaveBeenCalled();
		screen.update({ active: true });
		screen.dispose();
		expect(update).toHaveBeenCalledTimes(1);
		expect(unmount).toHaveBeenCalledTimes(1);
	});
	it('replaces a mounted instance and makes dispose idempotent without allowing retry afterward', () => {
		const firstUnmount = vi.fn();
		const secondUnmount = vi.fn();
		const first = {
			[CHRONOS_MOUNTABLE]: true as const,
			mount: vi.fn(() => ({ unmount: firstUnmount }))
		};
		const second = {
			[CHRONOS_MOUNTABLE]: true as const,
			mount: vi.fn(() => ({ unmount: secondUnmount }))
		};
		const screen = createMountableController(vi.fn());
		screen.mount(first, target(), {});
		screen.mount(second, target(), {});
		expect(firstUnmount).toHaveBeenCalledTimes(1);
		screen.dispose();
		screen.dispose();
		screen.retry({});
		expect(secondUnmount).toHaveBeenCalledTimes(1);
		expect(second.mount).toHaveBeenCalledTimes(1);
		expect(screen.state.phase).toBe('idle');
	});
});
