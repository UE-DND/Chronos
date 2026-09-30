import { getEventListeners } from 'node:events';
import { describe, expect, it } from 'vite-plus/test';
import { mergeAbortSignals } from './abort-signal';

describe('merged abort signal lifetime', () => {
	it('removes listeners after successful operations sharing a long-lived signal', () => {
		const lifecycle = new AbortController();
		for (let i = 0; i < 5; i++) {
			const operation = new AbortController();
			const merged = mergeAbortSignals([lifecycle.signal, operation.signal]);
			expect(merged.signal.aborted).toBe(false);
			merged.dispose();
			merged.dispose();
			expect(getEventListeners(operation.signal, 'abort')).toHaveLength(0);
		}
		expect(getEventListeners(lifecycle.signal, 'abort')).toHaveLength(0);
	});

	it('preserves the abort reason and removes listeners from all sources', () => {
		const first = new AbortController();
		const second = new AbortController();
		const merged = mergeAbortSignals([first.signal, second.signal, first.signal]);
		const reason = new DOMException('Stopped', 'AbortError');
		second.abort(reason);
		expect(merged.signal.reason).toBe(reason);
		expect(getEventListeners(first.signal, 'abort')).toHaveLength(0);
		expect(getEventListeners(second.signal, 'abort')).toHaveLength(0);
	});

	it('does not attach listeners when a later input is already aborted', () => {
		const first = new AbortController();
		const second = new AbortController();
		second.abort('already stopped');
		const merged = mergeAbortSignals([first.signal, second.signal]);
		expect(merged.signal.reason).toBe('already stopped');
		expect(getEventListeners(first.signal, 'abort')).toHaveLength(0);
		merged.dispose();
	});

	it('does not detach consumers of a single source signal', () => {
		const source = new AbortController();
		const merged = mergeAbortSignals([source.signal]);
		merged.dispose();
		source.abort('direct signal');
		expect(merged.signal.reason).toBe('direct signal');
	});
});
