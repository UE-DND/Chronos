import { expect, it, vi } from 'vite-plus/test';
import { createSinglePointerSession } from '../src/gesture/single-pointer-session.svelte';

function event(pointerId: number, isPrimary = true): PointerEvent {
	return { pointerId, isPrimary, button: 0 } as PointerEvent;
}

it('preserves ownership across competing primary pointers and unrelated releases', () => {
	const session = createSinglePointerSession();
	expect(session.start(event(1))).toBe(true);
	expect(session.start(event(2))).toBe(false);
	expect(session.owns(event(2))).toBe(false);
	expect(session.owns(event(1))).toBe(true);
	session.end();
	expect(session.start(event(2, false))).toBe(false);
	expect(session.start(event(3))).toBe(true);
	session.end();
});

it('clears ownership before releasing capture and releases only once', () => {
	const session = createSinglePointerSession();
	let ownedDuringRelease = true;
	const releasePointerCapture = vi.fn(() => {
		ownedDuringRelease = session.owns(event(1));
		session.end();
	});
	const element = {
		setPointerCapture: vi.fn(),
		hasPointerCapture: () => true,
		releasePointerCapture
	} as unknown as HTMLElement;
	expect(session.start(event(1), element)).toBe(true);
	session.end();
	session.end();
	expect(ownedDuringRelease).toBe(false);
	expect(releasePointerCapture).toHaveBeenCalledExactlyOnceWith(1);
});

it('can end and restart when native capture becomes unavailable', () => {
	const session = createSinglePointerSession();
	const element = {
		setPointerCapture() {
			throw new Error('Pointer ended');
		},
		hasPointerCapture() {
			throw new Error('Element removed');
		}
	} as unknown as HTMLElement;
	expect(session.start(event(1), element)).toBe(true);
	session.end();
	expect(session.id).toBeNull();
	expect(session.start(event(2))).toBe(true);
	session.end();
});
