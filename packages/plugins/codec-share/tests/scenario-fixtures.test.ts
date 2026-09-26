import { describe, expect, it } from 'vite-plus/test';
import { encodeSharePayload, decodeSharePayload } from '../src/share-link/chronos-share-link-codec';
import timetable from '../../../core/tests/fixtures/timetable.json';
import expected from '../../../core/tests/fixtures/timetable.expected.json';
describe('shared scenario share round trip', () => {
	it('preserves course schedules and weekend visibility in the current format', async () => {
		const payload = await encodeSharePayload(timetable);
		expect(payload).toMatch(/^1\./);
		const decoded = await decodeSharePayload(payload);
		expect(decoded.ok).toBe(true);
		if (!decoded.ok) throw new Error(decoded.errorMessage);
		expect(
			decoded.value.courses.map(
				({ name, teacher, location, dayOfWeek, startPeriod, endPeriod, weeks }) => ({
					name,
					teacher,
					location,
					dayOfWeek,
					startPeriod,
					endPeriod,
					weeks
				})
			)
		).toEqual(expected.courses);
		expect(decoded.value.viewPrefs).toMatchObject(expected.weekend);
	});
});
