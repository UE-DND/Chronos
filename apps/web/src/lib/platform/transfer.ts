import type { ExportResult } from '@chronos/core';
import { writeClipboardText } from '@chronos/ui-kit';
import { getHostPlatform } from './host-platform';

export type ExportDeliveryResult =
	| { status: 'downloaded'; filename: string }
	| { status: 'shared'; filename: string }
	| { status: 'canceled' }
	| { status: 'failed'; error?: unknown };

function browserDownload(result: ExportResult, fallbackFilename: string): void {
	const part: BlobPart =
		typeof result.content === 'string' ? result.content : new Uint8Array(result.content);
	const blob = new Blob([part], { type: result.mimeType });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = result.filename ?? fallbackFilename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

export async function downloadExportResult(
	result: ExportResult,
	fallbackFilename = 'timetable-export'
): Promise<ExportDeliveryResult> {
	const filename = result.filename ?? fallbackFilename;
	const platform = getHostPlatform();

	if (platform.isNative && platform.shareFile) {
		const shareResult = await platform.shareFile(filename, result.content, result.mimeType);
		if (shareResult.status === 'shared') {
			return { status: 'shared', filename };
		}
		if (shareResult.status === 'canceled') {
			return { status: 'canceled' };
		}
		try {
			browserDownload(result, fallbackFilename);
			return { status: 'downloaded', filename };
		} catch (error) {
			return { status: 'failed', error: shareResult.error ?? error };
		}
	}

	browserDownload(result, fallbackFilename);
	return { status: 'downloaded', filename };
}

export async function copyTextWithFallback(text: string): Promise<boolean> {
	return writeClipboardText(text);
}

export function withTimeout<T>(
	promise: Promise<T>,
	ms = 15000,
	timeoutMessage = 'timeout'
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(error) => {
				clearTimeout(timer);
				reject(error);
			}
		);
	});
}
