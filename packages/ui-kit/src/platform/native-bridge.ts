import type { NativeHostBridge } from '@chronos/core';

/** Narrow injection point used by Chronos native shells (WKWebView / Android WebView). */
export const CHRONOS_NATIVE_BRIDGE_KEY = '__CHRONOS_NATIVE__' as const;

type ChronosWindow = Window & {
	[CHRONOS_NATIVE_BRIDGE_KEY]?: unknown;
};

/**
 * Detect a host-injected native bridge without touching other globals.
 * Accepts `window.__CHRONOS_NATIVE__` when it exposes `callNative` (NativeHostBridge shape).
 */
export function getNativeBridge(): NativeHostBridge | null {
	if (typeof window === 'undefined') return null;
	const candidate = (window as ChronosWindow)[CHRONOS_NATIVE_BRIDGE_KEY];
	if (
		candidate != null &&
		typeof candidate === 'object' &&
		typeof (candidate as NativeHostBridge).callNative === 'function'
	) {
		return candidate as NativeHostBridge;
	}
	return null;
}
