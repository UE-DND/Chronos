import { expect, test } from '@playwright/test';
import fixture from '../../packages/core/tests/fixtures/timetable.json' with { type: 'json' };
import { encodeSharePayload } from '../../packages/plugins/codec-share/src/share-link/chronos-share-link-codec.ts';
import type { Timetable } from '../../packages/core/src/domain/timetable';

const payload = (name: string) => encodeSharePayload({ ...fixture, name } as Timetable);

test('synchronizes the overwrite target across tabs and preserves the other timetable', async ({
	page,
	context,
	request
}) => {
	await request.post('/__e2e/deploy?build=old');
	await context.addInitScript(() => localStorage.setItem('chronos:onboarding-seen', '1'));
	for (const name of ['课表 A', '课表 B']) {
		await page.goto(`/Chronos/s#${await payload(name)}`);
		await page.getByRole('button', { name: '导入为新课程表', exact: true }).click();
		await expect(page.locator('.timetable-week-pager')).toBeVisible();
	}
	await page.goto('/Chronos/manage-timetables');
	await page.getByRole('button', { name: /课表 A/ }).click();
	await expect(page.getByRole('button', { name: /课表 A/ }).locator('input')).toBeChecked();
	const other = await context.newPage();
	await other.goto(`/Chronos/s#${await payload('导入 C')}`);
	await expect(other.getByText('当前课程表：课表 A', { exact: true })).toBeVisible();
	await page.getByRole('button', { name: /课表 B/ }).click();
	await expect(other.getByText('当前课程表：课表 B', { exact: true })).toBeVisible();
	await other.getByRole('button', { name: /覆盖当前课程表/ }).click();
	await other.getByRole('button', { name: '覆盖当前课程表', exact: true }).click();
	await expect(other.locator('.timetable-week-pager')).toBeVisible();
	await other.goto('/Chronos/manage-timetables');
	await expect(other.getByRole('button', { name: /课表 A/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /导入 C/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /课表 B/ })).toHaveCount(0);
	await other.reload();
	await expect(other.getByRole('button', { name: /课表 A/ })).toBeVisible();
	await expect(other.getByRole('button', { name: /导入 C/ }).locator('input')).toBeChecked();
});
