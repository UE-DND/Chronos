import { writeClipboardText } from '@chronos/ui-kit';

export async function copyTextWithFallback(text: string): Promise<boolean> {
	return writeClipboardText(text);
}
