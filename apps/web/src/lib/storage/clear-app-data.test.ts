import { describe, expect, it } from 'vite-plus/test';
import { estimateStorageBytes } from './clear-app-data';
import { formatBytes } from '$lib/utils/format-bytes';

function createMemoryStorage(initial: Record<string, string> = {}): Storage {
	const map = new Map(Object.entries(initial));
	return {
		getItem: (key: string) => map.get(key) ?? null,
		setItem: (key: string, value: string) => map.set(key, value),
		removeItem: (key: string) => map.delete(key),
		clear: () => map.clear(),
		key: (index: number) => [...map.keys()][index] ?? null,
		get length() {
			return map.size;
		}
	} as Storage;
}

describe('estimateStorageBytes', () => {
	it('sums utf-8 byte length for keys and values with the given prefix', () => {
		const storage = createMemoryStorage({
			'chronos:preview': 'ab',
			'chronos_preferences:theme_mode': 'dark',
			'other:key': 'ignored'
		});

		expect(estimateStorageBytes(storage, 'chronos')).toBe(
			new TextEncoder().encode('chronos:preview').length +
				new TextEncoder().encode('ab').length +
				new TextEncoder().encode('chronos_preferences:theme_mode').length +
				new TextEncoder().encode('dark').length
		);
	});
});

describe('formatBytes', () => {
	it('formats bytes, kilobytes, and megabytes', () => {
		expect(formatBytes(512)).toBe('512 B');
		expect(formatBytes(1536)).toBe('1.5 KB');
		expect(formatBytes(2 * 1024 * 1024)).toBe('2.0 MB');
	});
});
