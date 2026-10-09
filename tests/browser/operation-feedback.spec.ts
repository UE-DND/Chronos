import { expect, test, type Page } from '@playwright/test';
import timetable from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = await encodeSharePayload(timetable as Timetable);

test.use({ viewport: { width: 390, height: 844 } });

test('display settings write once for row, radio and keyboard activation', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		localStorage.setItem('chronos:/Chronos:chronos_preferences:timetable_layout_mode', 'fixed');
	});
	await page.goto('/Chronos/display-settings');
	await expect(page.getByText('暗色主题', { exact: true })).toBeVisible();
	await page.evaluate(() => {
		const writes: string[] = [];
		const otherWrites: { key: string; value: string }[] = [];
		Object.assign(window, { preferenceWrites: writes, otherPreferenceWrites: otherWrites });
		const setItem = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
			.value as Storage['setItem'];
		Storage.prototype.setItem = function (key, value) {
			if (key === 'chronos:/Chronos:chronos_preferences:theme_mode') writes.push(value);
			if (
				key === 'chronos:/Chronos:chronos_preferences:timetable_layout_mode' ||
				key === 'chronos:/Chronos:chronos_preferences:capsule_corner_style'
			)
				otherWrites.push({ key, value });
			setItem.call(this, key, value);
		};
	});
	const writes = () =>
		page.evaluate(() => (window as unknown as { preferenceWrites: string[] }).preferenceWrites);
	await page.getByText('暗色主题', { exact: true }).click();
	await expect(page.getByRole('radio', { name: '暗色主题' })).toBeChecked();
	expect(await writes()).toEqual(['dark']);
	await page.getByText('暗色主题', { exact: true }).click();
	expect(await writes()).toEqual(['dark']);
	await page.locator('label').filter({ hasText: '亮色主题' }).locator('input + div').click();
	await expect(page.getByRole('radio', { name: '亮色主题' })).toBeChecked();
	expect(await writes()).toEqual(['dark', 'light']);
	await page.getByRole('radio', { name: '跟随系统' }).focus();
	await page.getByRole('radio', { name: '跟随系统' }).press('Space');
	await expect(page.getByRole('radio', { name: '跟随系统' })).toBeChecked();
	expect(await writes()).toEqual(['dark', 'light', 'auto']);
	await page.getByText('一屏显示', { exact: true }).click();
	await page.getByText('一屏显示', { exact: true }).click();
	await page.getByText('合并圆角', { exact: true }).click();
	await page.getByText('合并圆角', { exact: true }).click();
	expect(
		await page.evaluate(
			() =>
				(window as unknown as { otherPreferenceWrites: { key: string; value: string }[] })
					.otherPreferenceWrites
		)
	).toEqual([
		{ key: 'chronos:/Chronos:chronos_preferences:timetable_layout_mode', value: 'compact' },
		{ key: 'chronos:/Chronos:chronos_preferences:capsule_corner_style', value: 'pill' }
	]);
});

for (const activation of ['row', 'keyboard'] as const) {
	for (const setting of [
		{ key: 'theme_mode', before: 'auto', after: 'dark', initial: '跟随系统', target: '暗色主题' },
		{
			key: 'timetable_layout_mode',
			before: 'fixed',
			after: 'compact',
			initial: '滚动查看',
			target: '一屏显示'
		},
		{
			key: 'capsule_corner_style',
			before: 'sharp',
			after: 'pill',
			initial: '移除圆角',
			target: '合并圆角'
		},
		{
			key: 'current_period_highlight_enabled',
			before: '0',
			after: '1',
			initial: '',
			target: '高亮当前节次'
		}
	]) {
		test(`display settings recover and retry ${setting.key} with ${activation} after storage failure`, async ({
			page,
			request
		}) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript(({ key, before }) => {
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
				if (localStorage.getItem(`chronos:/Chronos:chronos_preferences:${key}`) === null)
					localStorage.setItem(`chronos:/Chronos:chronos_preferences:${key}`, before);
			}, setting);
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto('/Chronos/display-settings');
			const control = page.getByRole(setting.initial ? 'radio' : 'switch', {
				name: setting.target
			});
			await expect(control).not.toBeChecked();
			await page.evaluate((key) => {
				const setItem = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
					.value as Storage['setItem'];
				let attempts = 0;
				Object.assign(window, { preferenceAttempts: () => attempts });
				Storage.prototype.setItem = function (name, value) {
					if (name === `chronos:/Chronos:chronos_preferences:${key}` && ++attempts === 1)
						throw new DOMException('Test preference failure', 'QuotaExceededError');
					setItem.call(this, name, value);
				};
			}, setting.key);
			await page.getByText(setting.target, { exact: true }).click();
			await expect(
				page.getByRole('status').filter({ hasText: '设置保存失败，请重试' })
			).toBeVisible();
			await expect(control).not.toBeChecked();
			if (setting.initial)
				await expect(page.getByRole('radio', { name: setting.initial })).toBeChecked();
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(`chronos:/Chronos:chronos_preferences:${key}`),
					setting.key
				)
			).toBe(setting.before);
			if (activation === 'row') {
				await page.getByText(setting.target, { exact: true }).click();
			} else {
				await control.focus();
				await control.press('Space');
			}
			await expect(control).toBeChecked();
			await expect
				.poll(() =>
					page.evaluate(
						(key) => localStorage.getItem(`chronos:/Chronos:chronos_preferences:${key}`),
						setting.key
					)
				)
				.toBe(setting.after);
			expect(
				await page.evaluate(() =>
					(window as unknown as { preferenceAttempts(): number }).preferenceAttempts()
				)
			).toBe(2);
			expect(errors).toEqual([]);
			await page.reload();
			await expect(control).toBeChecked();
			await page.getByText(setting.initial || setting.target, { exact: true }).click();
			await expect(control).not.toBeChecked();
			await expect
				.poll(() =>
					page.evaluate(
						(key) => localStorage.getItem(`chronos:/Chronos:chronos_preferences:${key}`),
						setting.key
					)
				)
				.toBe(setting.before);
		});
	}
}

test('display settings disable compact layout in landscape without writing preferences', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.setViewportSize({ width: 844, height: 390 });
	await page.addInitScript(() => {
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1');
		localStorage.setItem('chronos:/Chronos:chronos_preferences:timetable_layout_mode', 'fixed');
	});
	await page.goto('/Chronos/display-settings');
	const compact = page.getByRole('radio', { name: /^一屏显示/ });
	await expect(compact).toBeDisabled();
	await page.getByText('一屏显示', { exact: true }).click({ force: true });
	await expect(compact).not.toBeChecked();
	await expect(page.getByRole('radio', { name: /^滚动查看/ })).toBeChecked();
	expect(
		await page.evaluate(() =>
			localStorage.getItem('chronos:/Chronos:chronos_preferences:timetable_layout_mode')
		)
	).toBe('fixed');
});

async function holdStorage(page: Page) {
	await page.evaluate(
		() =>
			new Promise<void>((resolve, reject) => {
				const open = indexedDB.open('chronos:/Chronos:db');
				open.onerror = () => reject(open.error);
				open.onsuccess = () => {
					const db = open.result;
					const transaction = db.transaction(['timetables', 'courses'], 'readwrite');
					let released = false;
					Object.assign(window, {
						releaseStorage: () => {
							released = true;
						}
					});
					transaction.oncomplete = () => db.close();
					transaction.onerror = () => reject(transaction.error);
					const keepAlive = () => {
						const read = transaction.objectStore('timetables').get('feedback-lock');
						read.onsuccess = () => {
							resolve();
							if (!released) keepAlive();
						};
					};
					keepAlive();
				};
			})
	);
}

async function releaseStorage(page: Page) {
	await page.evaluate(() => (window as unknown as { releaseStorage(): void }).releaseStorage());
}

for (const viewport of [
	{ width: 390, height: 844 },
	{ width: 844, height: 390 }
]) {
	test.describe(`pending actions at ${viewport.width}px`, () => {
		test.use({ viewport });
		test('course save stays busy until persistence finishes and reports failure', async ({
			page,
			request
		}, testInfo) => {
			await request.post('/__e2e/deploy?build=old');
			await page.addInitScript(() =>
				localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
			);
			await page.goto(`/Chronos/s#${payload}`);
			await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
			await expect(page.locator('.timetable-week-pager')).toBeVisible();
			const courseId = await page.evaluate(
				() =>
					new Promise<string>((resolve, reject) => {
						const open = indexedDB.open('chronos:/Chronos:db');
						open.onerror = () => reject(open.error);
						open.onsuccess = () => {
							const db = open.result;
							const read = db.transaction('courses').objectStore('courses').getAll();
							read.onsuccess = () => {
								resolve(read.result[0].id);
								db.close();
							};
						};
					})
			);
			await page.goto(`/Chronos/timetable/course-editor?courseId=${encodeURIComponent(courseId)}`);
			await page.getByRole('textbox', { name: '课程名称', exact: true }).fill('保存反馈测试');
			await holdStorage(page);
			await page
				.getByRole('button', { name: '保存', exact: true })
				.filter({ visible: true })
				.click();
			const pending = page
				.getByRole('button', { name: '保存中…', exact: true })
				.filter({ visible: true });
			await expect(pending).toBeDisabled();
			await expect(pending).toHaveAttribute('aria-busy', 'true');
			await page.screenshot({ path: testInfo.outputPath('saving.png') });
			await expect(
				page.getByRole('button', { name: '删除课程', exact: true }).filter({ visible: true })
			).toBeDisabled();
			await releaseStorage(page);
			await expect(page.locator('.timetable-week-pager')).toBeVisible();
			await page.goto(`/Chronos/timetable/course-editor?courseId=${encodeURIComponent(courseId)}`);
			await expect(page.getByRole('textbox', { name: '课程名称', exact: true })).toHaveValue(
				'保存反馈测试'
			);
			await page.evaluate(() => {
				IDBObjectStore.prototype.put = function () {
					throw new DOMException('Test write failure', 'QuotaExceededError');
				};
			});
			await page
				.getByRole('button', { name: '保存', exact: true })
				.filter({ visible: true })
				.click();
			await expect(
				page.getByRole('status').filter({ hasText: '课程保存失败，请重试' })
			).toBeVisible();
			await expect(
				page.getByRole('button', { name: '保存', exact: true }).filter({ visible: true })
			).toBeEnabled();
			await expect(page.getByRole('textbox', { name: '课程名称', exact: true })).toHaveValue(
				'保存反馈测试'
			);
		});
	});
}

test('timetable details save displays progress and recovers after a write failure', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	await page.goto('/Chronos/timetable/details');
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	await expect(page.getByRole('button', { name: '保存', exact: true })).toBeEnabled();
	await holdStorage(page);
	await page.getByRole('button', { name: '保存', exact: true }).click();
	await expect(page.getByRole('button', { name: '保存中…', exact: true })).toHaveAttribute(
		'aria-busy',
		'true'
	);
	await expect(page.getByRole('button', { name: '恢复默认设置', exact: true })).toBeDisabled();
	await releaseStorage(page);
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	await page.goto('/Chronos/timetable/details');
	await expect(page.locator('#chronos-boot-fallback')).toBeHidden();
	await expect(page.getByRole('button', { name: '保存', exact: true })).toBeEnabled();
	await page.evaluate(() => {
		IDBObjectStore.prototype.put = function () {
			throw new DOMException('Test write failure', 'QuotaExceededError');
		};
	});
	await page.getByRole('button', { name: '保存', exact: true }).click();
	await expect(page.getByRole('status').filter({ hasText: '保存课表失败' })).toBeVisible();
	await expect(page.getByRole('button', { name: '保存', exact: true })).toBeEnabled();
});

test('course deletion displays progress and leaves a failed operation retryable', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	await page.goto(`/Chronos/s#${payload}`);
	await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
	await expect(page.locator('.timetable-week-pager')).toBeVisible();
	const pager = page.locator('.timetable-week-pager');
	const index = await pager.evaluate((node) => Math.round(node.scrollLeft / node.clientWidth));
	await pager.locator('.timetable-week-page').nth(index).locator('.course-capsule').first().click();
	await page.getByRole('button', { name: '编辑课程', exact: true }).click();
	await page.getByRole('button', { name: '删除课程', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog.getByRole('button', { name: '删除', exact: true })).toBeVisible();
	await holdStorage(page);
	await page.evaluate(() => {
		IDBObjectStore.prototype.delete = function () {
			throw new DOMException('Test deletion failure', 'UnknownError');
		};
	});
	await dialog.getByRole('button', { name: '删除', exact: true }).click();
	await expect(dialog.getByRole('button', { name: '删除中…', exact: true })).toBeDisabled();
	await expect(page.getByRole('button', { name: '保存', exact: true })).toBeDisabled();
	await releaseStorage(page);
	await expect(page.getByRole('status').filter({ hasText: '课程删除失败，请重试' })).toBeVisible();
	await expect(dialog.getByRole('button', { name: '删除', exact: true })).toBeEnabled();
});

test('timetable switching and deletion show progress and recover from storage errors', async ({
	page,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await page.addInitScript(() =>
		localStorage.setItem('chronos:/Chronos:chronos:onboarding-seen', '1')
	);
	for (const source of [timetable, { ...timetable, name: '第二课表' }]) {
		await page.goto(`/Chronos/s#${await encodeSharePayload(source as Timetable)}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
	}
	await page.goto('/Chronos/manage-timetables');
	const target = page.getByRole('button', { name: new RegExp(timetable.name) });
	await expect(target).toBeVisible();
	await holdStorage(page);
	await page.evaluate(() => {
		const setItem = Object.getOwnPropertyDescriptor(Storage.prototype, 'setItem')!
			.value as Storage['setItem'];
		Storage.prototype.setItem = function (key, value) {
			if (key === 'chronos:/Chronos:chronos_preferences:current_timetable_id')
				throw new DOMException('Test switch failure', 'QuotaExceededError');
			setItem.call(this, key, value);
		};
	});
	await target.click();
	await expect(target).toContainText('切换中…');
	await expect(target).toBeDisabled();
	await expect(page.getByRole('button', { name: '删除课表', exact: true })).toBeDisabled();
	await releaseStorage(page);
	await expect(page.getByRole('status').filter({ hasText: '课表切换失败，请重试' })).toBeVisible();
	await expect(target).toBeEnabled();
	await page.getByRole('button', { name: '删除课表', exact: true }).click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toContainText('第二课表');
	await holdStorage(page);
	await page.evaluate(() => {
		IDBObjectStore.prototype.delete = function () {
			throw new DOMException('Test deletion failure', 'UnknownError');
		};
	});
	await dialog.getByRole('button', { name: '删除', exact: true }).click();
	await expect(dialog.getByRole('button', { name: '删除中…', exact: true })).toHaveAttribute(
		'aria-busy',
		'true'
	);
	await releaseStorage(page);
	await expect(page.getByRole('status').filter({ hasText: '课表删除失败，请重试' })).toBeVisible();
	await expect(dialog.getByRole('button', { name: '删除', exact: true })).toBeEnabled();
});
