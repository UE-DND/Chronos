import { afterEach, expect, it, vi } from 'vite-plus/test';
import { installScrollBoundaryFeedback } from './scroll-boundary-feedback';

const { light } = vi.hoisted(() => ({ light: vi.fn() }));
vi.mock('$lib/haptic/haptic', () => ({ haptic: { light } }));

function harness() {
	class Surface {
		style = { opacity: '0' };
		dataset = {};
		scrollTop = 0;
		scrollHeight = 400;
		clientHeight = 200;
		closest() {
			return this;
		}
		getBoundingClientRect() {
			return { left: 0, top: 0, bottom: 200, width: 200 };
		}
		setAttribute() {}
		removeAttribute() {}
		remove() {}
	}
	vi.stubGlobal('Element', Surface);
	const node = new Surface();
	const indicator = new Surface();
	const doc = Object.assign(new EventTarget(), {
		body: { append: vi.fn() },
		createElement: () => indicator
	});
	const cleanup = installScrollBoundaryFeedback(doc as unknown as Document);
	function touch(type: string, x: number, y: number) {
		const points = [{ identifier: 1, clientX: x, clientY: y }];
		const event = Object.assign(new Event(type), {
			touches: type === 'touchend' ? [] : points,
			changedTouches: points
		});
		Object.defineProperty(event, 'target', { value: node });
		doc.dispatchEvent(event);
	}
	return { doc, node, indicator, cleanup, touch };
}

afterEach(() => {
	vi.clearAllMocks();
	vi.unstubAllGlobals();
});

it('does not glow or vibrate for horizontal motion with vertical drift at a scroll boundary', () => {
	const h = harness();
	try {
		h.touch('touchstart', 100, 100);
		h.touch('touchmove', 200, 120);
		h.touch('touchend', 200, 120);
		expect(h.indicator.style.opacity).toBe('0');
		expect(light).not.toHaveBeenCalled();
	} finally {
		h.cleanup();
	}
});

it('keeps vertical boundary feedback and reversals available', () => {
	const h = harness();
	try {
		h.touch('touchstart', 100, 100);
		h.touch('touchmove', 102, 130);
		expect(Number(h.indicator.style.opacity)).toBeGreaterThan(0);
		h.touch('touchmove', 102, 110);
		expect(h.indicator.style.opacity).toBe('0');
		h.touch('touchmove', 102, 140);
		h.touch('touchend', 102, 140);
		expect(light).toHaveBeenCalledOnce();
	} finally {
		h.cleanup();
	}
});

it('ignores horizontal wheel drift at a scroll boundary', () => {
	const h = harness();
	try {
		const event = Object.assign(new Event('wheel'), { deltaX: 100, deltaY: -20 });
		Object.defineProperty(event, 'target', { value: h.node });
		h.doc.dispatchEvent(event);
		expect(h.indicator.style.opacity).toBe('0');
	} finally {
		h.cleanup();
	}
});
