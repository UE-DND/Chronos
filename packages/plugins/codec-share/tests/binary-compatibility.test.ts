import { expect, it } from 'vite-plus/test';
import { createCourse, createTimetable } from '@chronos/core';
import { encodeTimetableToBinary } from '../src/share-link/chronos-share-binary';

it('preserves version-one binary bytes across location and column optimizations', () => {
	const cases = [
		{ name: 'shared building', locations: ['教学楼A101', '教学楼A102'] },
		{ name: 'different buildings', locations: ['一教楼A101', '二教楼A102'] },
		{ name: 'mixed locations and optional columns', locations: ['操场', '教学楼A101'] },
		{ name: 'empty and split location', locations: ['', '教学楼A101'] }
	];
	const fixtures = Object.fromEntries(
		cases.map(({ name, locations }, caseIndex) => {
			const timetable = createTimetable({
				id: 'compatibility',
				name: 'T',
				academicConfig: {
					termStartDate: '2026-03-02',
					startWeek: 1,
					endWeek: caseIndex === 2 ? 21 : 20,
					periodTimes: []
				},
				courses: locations.map((location, index) =>
					createCourse({
						id: `c${index}`,
						name: `C${index}`,
						teacher: 'Lee',
						location,
						dayOfWeek: index + 1,
						startPeriod: 1,
						endPeriod: 2,
						weeks: caseIndex === 2 ? [index + 1, index + 3] : [1, 2, 3],
						remark: caseIndex === 2 && index === 0 ? 'Text' : ''
					})
				)
			});
			return [name, Buffer.from(encodeTimetableToBinary(timetable)).toString('hex')];
		})
	);
	expect(fixtures).toMatchInlineSnapshot(`
		{
		  "different buildings": "43530104cc08020005015402433009e4b880e69599e6a5bc02433109e4ba8ce69599e6a5bc0102810301034c6565010320402121020441313031204131303220",
		  "empty and split location": "43530104cc08020004015402433002433109e69599e5ada6e6a5bc0102810301034c6565010220402121ff0320202020204131303120",
		  "mixed locations and optional columns": "43530103cc08150200060154024330045465787406e6938de59cba02433109e69599e5ada6e6a5bc020405000000040a00000001034c656501042140212103052020202020413130312000010200",
		  "shared building": "4353010ccc0802020004015402433009e69599e5ada6e6a5bc0243310102810301034c656501032040212141313031204131303220",
		}
	`);
});
