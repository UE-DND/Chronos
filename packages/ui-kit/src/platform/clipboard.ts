import { getNativeBridge } from './native-bridge';

/**
 * Reads text from clipboard: prioritizes host native bridge (__CHRONOS_NATIVE__),
 * falling back to navigator.clipboard.readText() in standard Web browsers.
 */
export async function readClipboardText(): Promise<string> {
	const bridge = getNativeBridge();
	if (bridge) {
		try {
			const text = await bridge.callNative<undefined, string>('clipboard', 'readText');
			if (typeof text === 'string') return text;
		} catch {
			// Fallback to navigator.clipboard below
		}
	}

	if (typeof navigator !== 'undefined' && navigator.clipboard?.readText) {
		return navigator.clipboard.readText();
	}

	throw new Error('Clipboard read is not supported');
}

/**
 * Writes text to clipboard: prioritizes host native bridge (__CHRONOS_NATIVE__),
 * falling back to navigator.clipboard.writeText(), and finally execCommand('copy').
 */
export async function writeClipboardText(text: string): Promise<boolean> {
	const bridge = getNativeBridge();
	if (bridge) {
		try {
			await bridge.callNative<{ text: string }, void>('clipboard', 'writeText', { text });
			return true;
		} catch {
			// Fallback to Web Clipboard API below
		}
	}

	if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			// Fallback to textarea execCommand below
		}
	}

	if (typeof document !== 'undefined') {
		try {
			const textarea = document.createElement('textarea');
			textarea.value = text;
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			const ok = document.execCommand('copy');
			document.body.removeChild(textarea);
			return ok;
		} catch {
			return false;
		}
	}

	return false;
}
