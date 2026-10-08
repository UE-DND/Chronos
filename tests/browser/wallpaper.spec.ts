import { expect, test, type Page } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);
const crop = (page: Page) => page.getByLabel('画布裁剪手势', { exact: true });
const confirm = (page: Page) =>
	page.getByRole('button', { name: '确认裁剪', exact: true }).filter({ visible: true });
const cancel = (page: Page) =>
	page.getByRole('button', { name: '取消', exact: true }).filter({ visible: true });

declare global {
	interface Window {
		wallpaperTiming: {
			active: boolean;
			decoded: boolean;
			measured: boolean;
			releaseDecode: () => void;
			releaseFrame: () => void;
		};
		wallpaperCounts: {
			created: string[];
			revoked: string[];
			decoded: string[];
			published: string[];
			bitmapDecoded: string[];
		};
		wallpaperRestoreExport: () => void;
		wallpaperAttempts: () => number;
	}
}

async function imageFile(page: Page) {
	const data = await page.evaluate(() => {
		const canvas = document.createElement('canvas');
		canvas.width = 1600;
		canvas.height = 1200;
		const ctx = canvas.getContext('2d')!;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, 800, 1200);
		ctx.fillStyle = '#fff';
		ctx.fillRect(800, 0, 800, 1200);
		return canvas.toDataURL('image/png').split(',')[1];
	});
	return { name: 'wallpaper.png', mimeType: 'image/png', buffer: Buffer.from(data, 'base64') };
}

async function importTimetable(page: Page) {
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
}

async function choose(page: Page) {
	await page.locator('input[type=file]').setInputFiles(await imageFile(page));
	await expect(confirm(page)).toBeEnabled();
}

for (const viewport of [
	{ width: 390, height: 844 },
	{ width: 1280, height: 900 }
]) {
	test.describe(`wallpaper at ${viewport.width}px`, () => {
		test.use({ viewport });
		test.beforeEach(async ({ page, request }) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
		});

		test('initial cover is stable with decode and measurement in either order', async ({
			page
		}) => {
			await page.addInitScript(() => {
				window.wallpaperTiming = {
					active: false,
					decoded: false,
					measured: false,
					releaseDecode: () => {},
					releaseFrame: () => {}
				};
				const decode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode')!
					.value as HTMLImageElement['decode'];
				HTMLImageElement.prototype.decode = async function () {
					await decode.call(this);
					if (!window.wallpaperTiming.active || this.isConnected || !this.src.startsWith('blob:'))
						return;
					window.wallpaperTiming.decoded = true;
					await new Promise<void>((resolve) => {
						window.wallpaperTiming.releaseDecode = resolve;
					});
				};
				const NativeResizeObserver = ResizeObserver;
				window.ResizeObserver = class extends NativeResizeObserver {
					constructor(callback: ResizeObserverCallback) {
						super((entries, observer) => {
							if (
								!window.wallpaperTiming.active ||
								!entries.some((entry) => entry.target.getAttribute('aria-label') === '画布裁剪手势')
							) {
								callback(entries, observer);
								return;
							}
							window.wallpaperTiming.measured = true;
							window.wallpaperTiming.releaseFrame = () => {
								window.wallpaperTiming.active = false;
								callback(entries, observer);
							};
						});
					}
				};
			});
			await page.goto('/Chronos/wallpaper/preview');
			const file = await imageFile(page);
			for (let iteration = 0; iteration < 6; iteration++) {
				await page.evaluate(() =>
					Object.assign(window.wallpaperTiming, { active: true, decoded: false, measured: false })
				);
				await page.locator('input[type=file]').setInputFiles(file);
				await expect
					.poll(() =>
						page.evaluate(() => window.wallpaperTiming.decoded && window.wallpaperTiming.measured)
					)
					.toBe(true);
				await expect(confirm(page)).toBeDisabled();
				if (iteration % 2 === 0) {
					await page.evaluate(() => window.wallpaperTiming.releaseDecode());
					await page.evaluate(() => new Promise(requestAnimationFrame));
					await expect(confirm(page)).toBeDisabled();
					await page.evaluate(() => window.wallpaperTiming.releaseFrame());
				} else {
					await page.evaluate(() => window.wallpaperTiming.releaseFrame());
					await page.evaluate(() => new Promise(requestAnimationFrame));
					await expect(confirm(page)).toBeDisabled();
					await page.evaluate(() => window.wallpaperTiming.releaseDecode());
				}
				await expect(confirm(page)).toBeEnabled();
				const geometry = await crop(page).evaluate((frame) => {
					const img = frame.querySelector('img')!;
					return {
						width: Math.round(frame.clientWidth),
						height: Math.round(frame.clientHeight),
						imageWidth: parseFloat(img.style.width),
						imageHeight: parseFloat(img.style.height),
						left: parseFloat(img.style.left),
						top: parseFloat(img.style.top)
					};
				});
				const scale = Math.max(geometry.width / 1600, geometry.height / 1200);
				expect(geometry.imageWidth / 1600).toBeCloseTo(scale, 5);
				expect(geometry.left).toBeCloseTo((geometry.width - geometry.imageWidth) / 2, 3);
				expect(geometry.top).toBeCloseTo((geometry.height - geometry.imageHeight) / 2, 3);
				await cancel(page).click();
			}
		});

		test('source selection rolls back native radio and retries by row, radio and keyboard', async ({
			page
		}) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto('/Chronos/wallpaper');
			const none = page.getByRole('radio', { name: '无壁纸', exact: true });
			const custom = page.getByRole('radio', { name: '自定义', exact: true });
			for (const activation of ['row', 'radio', 'keyboard']) {
				await expect(none).toBeChecked();
				await page.evaluate(() => {
					const setItem = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
						.value as Storage['setItem'];
					let attempts = 0;
					window.wallpaperAttempts = () => attempts;
					Storage.prototype.setItem = function (key, value) {
						if (
							key === 'chronos_preferences:wallpaper_source' &&
							value === 'custom' &&
							++attempts === 1
						)
							throw new DOMException('Test failure', 'QuotaExceededError');
						setItem.call(this, key, value);
					};
				});
				const activate = async () => {
					if (activation === 'keyboard') {
						await custom.focus();
						await custom.press('Space');
					} else if (activation === 'radio')
						await page.locator('label').filter({ has: custom }).locator('input + div').click();
					else await page.getByText('自定义', { exact: true }).click();
				};
				await activate();
				await expect(
					page.getByRole('status').filter({ hasText: '设置保存失败，请重试' })
				).toBeVisible();
				await expect(none).toBeChecked();
				await expect(custom).not.toBeChecked();
				await expect(page.getByRole('link', { name: '选择壁纸', exact: true })).toHaveCount(0);
				await activate();
				await expect(custom).toBeChecked();
				await expect(page.getByRole('link', { name: '选择壁纸', exact: true })).toBeVisible();
				expect(await page.evaluate(() => window.wallpaperAttempts())).toBe(2);
				await expect
					.poll(() =>
						page.evaluate(() => localStorage.getItem('chronos_preferences:wallpaper_source'))
					)
					.toBe('custom');
				await page.getByText('无壁纸', { exact: true }).click();
			}
			expect(errors).toEqual([]);
		});

		test('canvas failures notify once and preserve crop for retry', async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto('/Chronos/wallpaper/preview');
			for (const failure of ['null', 'throw']) {
				await choose(page);
				const before = await crop(page).locator('img').getAttribute('style');
				await page.evaluate((failure) => {
					const toBlob = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'toBlob')!
						.value as HTMLCanvasElement['toBlob'];
					window.wallpaperRestoreExport = () => {
						HTMLCanvasElement.prototype.toBlob = toBlob;
					};
					HTMLCanvasElement.prototype.toBlob = function (callback) {
						if (failure === 'throw') throw new Error('Test canvas exception');
						callback(null);
					};
				}, failure);
				await confirm(page).click();
				await expect(
					page.getByRole('status').filter({ hasText: '壁纸导入失败，请重试' })
				).toHaveCount(1);
				await expect(confirm(page)).toBeEnabled();
				expect(await crop(page).locator('img').getAttribute('style')).toBe(before);
				await page.evaluate(() => window.wallpaperRestoreExport());
				await confirm(page).click();
				await expect(crop(page)).toHaveCount(0);
				await expect(
					page.getByRole('button', { name: '重新选择', exact: true }).filter({ visible: true })
				).toBeEnabled();
			}
			expect(errors).toEqual([]);
		});

		for (const themeMode of ['light', 'dark']) {
			test(`mask and adaptive text follow local preview and crop in ${themeMode} mode`, async ({
				page
			}) => {
				await page.addInitScript(
					(mode) => localStorage.setItem('chronos_preferences:theme_mode', mode),
					themeMode
				);
				await page.addInitScript(() => {
					if (localStorage.getItem('chronos_preferences:wallpaper_mask_enabled') === null)
						localStorage.setItem('chronos_preferences:wallpaper_mask_enabled', 'false');
				});
				await importTimetable(page);
				await page.goto('/Chronos/wallpaper/preview');
				await choose(page);
				const frame = crop(page);
				await expect(frame).toHaveAttribute('data-wallpaper-mask', 'false');
				await expect(frame.locator('.timetable-dynamic-tint-body')).toHaveCSS(
					'--dynamic-tint-grid',
					'transparent'
				);
				const month = frame.locator('[data-adaptive-text]').first();
				await expect(month).toHaveAttribute('data-adaptive-tone', 'light');
				const box = (await frame.boundingBox())!;
				await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
				await page.mouse.wheel(0, -100);
				const imageWidth = await frame
					.locator('img')
					.evaluate((img) => img.getBoundingClientRect().width);
				await page.mouse.move(box.x + box.width * 0.75, box.y + box.height / 2);
				await page.mouse.down();
				await page.mouse.move(box.x + 2, box.y + box.height / 2, { steps: 8 });
				await page.mouse.up();
				// Drag to the white half; repeat on wide frames where the available pan is smaller.
				for (let i = 0; i < 12; i++) {
					await page.mouse.wheel(0, -100);
				}
				await expect
					.poll(() => frame.locator('img').evaluate((img) => img.getBoundingClientRect().width))
					.toBeGreaterThan(imageWidth);
				for (let i = 0; i < 4; i++) {
					await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2);
					await page.mouse.down();
					await page.mouse.move(box.x + 2, box.y + box.height / 2, { steps: 8 });
					await page.mouse.up();
				}
				await expect
					.poll(() =>
						month.evaluate((text) => {
							const img = text.closest('[aria-label="画布裁剪手势"]')!.querySelector('img')!;
							return (
								(text.getBoundingClientRect().left - img.getBoundingClientRect().left) /
								img.getBoundingClientRect().width
							);
						})
					)
					.toBeGreaterThan(0.5);
				await expect(month).toHaveAttribute('data-adaptive-tone', 'dark');
				await confirm(page).click();
				const preview = page
					.locator('[data-wallpaper-mask][data-has-wallpaper=true]')
					.filter({ visible: true });
				await expect(preview).toHaveAttribute('data-wallpaper-mask', 'false');
				await expect(preview.locator('[data-adaptive-text]').first()).toHaveAttribute(
					'data-adaptive-tone',
					'dark'
				);
				await expect
					.poll(() =>
						page.evaluate(() => localStorage.getItem('chronos_preferences:wallpaper_source'))
					)
					.toBe('custom');
				await page.goto('/Chronos/wallpaper');
				await expect(page.getByRole('radio', { name: '自定义', exact: true })).toBeChecked();
				await page.getByRole('switch', { name: /^壁纸遮罩/ }).click();
				await expect(page.getByRole('switch', { name: /^壁纸遮罩/ })).toBeChecked();
				await expect
					.poll(() =>
						page.evaluate(() => localStorage.getItem('chronos_preferences:wallpaper_mask_enabled'))
					)
					.toBe('true');
				await page.goto('/Chronos/wallpaper/preview');
				await expect(
					page.locator('[data-wallpaper-mask=true]').filter({ visible: true })
				).toBeVisible();
				await expect(page.locator('[data-adaptive-tone]').filter({ visible: true })).toHaveCount(0);
				await choose(page);
				await expect(crop(page)).toHaveAttribute('data-wallpaper-mask', 'true');
				await expect(crop(page).locator('[data-adaptive-tone]')).toHaveCount(0);
			});
		}

		test('one save publishes one URL and external IndexedDB writes stay synchronized', async ({
			page,
			context
		}) => {
			await page.addInitScript(() => {
				if (localStorage.getItem('chronos_preferences:wallpaper_mask_enabled') === null)
					localStorage.setItem('chronos_preferences:wallpaper_mask_enabled', 'false');
			});
			await importTimetable(page);
			await page.goto('/Chronos/wallpaper/preview');
			await choose(page);
			await expect(crop(page).locator('[data-adaptive-tone]').first()).toBeVisible();
			await page.evaluate(() => {
				window.wallpaperCounts = {
					created: [],
					revoked: [],
					decoded: [],
					published: [],
					bitmapDecoded: []
				};
				const create = Object.getOwnPropertyDescriptor(URL, 'createObjectURL')!
					.value as typeof URL.createObjectURL;
				URL.createObjectURL = function (blob) {
					const uri = create.call(this, blob);
					window.wallpaperCounts.created.push(uri);
					return uri;
				};
				const revoke = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL')!
					.value as typeof URL.revokeObjectURL;
				URL.revokeObjectURL = function (uri) {
					window.wallpaperCounts.revoked.push(uri);
					revoke.call(this, uri);
				};
				const decode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode')!
					.value as HTMLImageElement['decode'];
				HTMLImageElement.prototype.decode = function () {
					window.wallpaperCounts.decoded.push(this.src);
					if (!this.isConnected) window.wallpaperCounts.bitmapDecoded.push(this.src);
					return decode.call(this);
				};
				const seen = new Set<string>();
				new MutationObserver(() => {
					for (const img of document.querySelectorAll<HTMLImageElement>(
						'[data-shell-wallpaper] img, [data-wallpaper-mask] img'
					)) {
						if (window.wallpaperCounts.created.includes(img.src) && !seen.has(img.src)) {
							seen.add(img.src);
							window.wallpaperCounts.published.push(img.src);
						}
					}
				}).observe(document.body, {
					subtree: true,
					childList: true,
					attributes: true,
					attributeFilter: ['src']
				});
			});
			await confirm(page).click();
			await expect(crop(page)).toHaveCount(0);
			const previewImage = page.locator('[data-wallpaper-mask] img');
			await expect(previewImage).toBeVisible();
			await expect(
				page.locator('[data-wallpaper-mask] [data-adaptive-tone]').filter({ visible: true }).first()
			).toBeVisible();
			const uri = await previewImage.getAttribute('src');
			const counts = await page.evaluate(() => window.wallpaperCounts);
			expect(counts.created).toEqual([uri]);
			expect(counts.published).toEqual([uri]);
			// Each view may explicitly decode, but all share this one URI and bitmap-cache entry.
			expect(new Set(counts.decoded)).toEqual(new Set([uri]));
			expect(counts.bitmapDecoded).toEqual([uri]);
			const other = await context.newPage();
			await other.goto('/Chronos/wallpaper/preview');
			await expect(other.locator('[data-wallpaper-mask] img')).toBeVisible();
			await choose(other);
			await confirm(other).click();
			await expect(crop(other)).toHaveCount(0);
			await expect.poll(() => previewImage.getAttribute('src')).not.toBe(uri);
			await expect
				.poll(() =>
					page.evaluate(() =>
						window.wallpaperCounts.revoked.includes(window.wallpaperCounts.created[0])
					)
				)
				.toBe(true);
			await other
				.getByRole('button', { name: '清除壁纸', exact: true })
				.filter({ visible: true })
				.click();
			await expect(previewImage).toHaveCount(0);
			await expect(page.getByText('选择壁纸后，可在此预览应用效果', { exact: true })).toBeVisible();
			await other.close();
		});
	});
}
