import type { Page } from '@playwright/test';

export async function captureOptionalScreenshot(
	page: Page,
	options: Parameters<Page['screenshot']>[0]
) {
	if (process.env.CHRONOS_E2E_SCREENSHOTS === '1') await page.screenshot(options);
}
