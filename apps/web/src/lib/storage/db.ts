import { storageNamespace } from './storage-namespace';
import Dexie, { type Table } from 'dexie';

export interface TimetableRow {
	id: string;
	name: string;
	createdAt: number;
	updatedAt: number;
	configJson: string;
}

export interface CourseRow {
	id: string;
	timetableId: string;
	name: string;
	teacher: string;
	location: string;
	dayOfWeek: number;
	startPeriod: number;
	endPeriod: number;
	weeksCsv: string;
	remark: string;
}

export interface PluginDataRow {
	id: string;
	pluginId: string;
	key: string;
	valueJson: string;
	updatedAt: number;
}

export interface PluginBinaryRow {
	id: string;
	pluginId: string;
	key: string;
	mimeType: string;
	bytes: ArrayBuffer;
	updatedAt: number;
}

/** Immutable executable and static plugin resources, referenced by installation metadata. */
export interface PluginResourceRow {
	id: string;
	pluginId: string;
	code?: string | null;
	cssCode?: string | null;
	colorsJson?: string | null;
	iconThemeJson?: string | null;
}

export class ChronosDB extends Dexie {
	timetables!: Table<TimetableRow, string>;
	courses!: Table<CourseRow, string>;
	pluginData!: Table<PluginDataRow, string>;
	pluginBinary!: Table<PluginBinaryRow, string>;
	pluginResources!: Table<PluginResourceRow, string>;
	images!: Table<{ id: string; blob: Blob }, string>;

	constructor(name = storageNamespace.databaseName) {
		super(name);
		this.version(1).stores({
			timetables: 'id, updatedAt',
			courses: 'id, timetableId, [timetableId+dayOfWeek]',
			pluginData: 'id, pluginId, key, updatedAt',
			pluginBinary: 'id, pluginId, key, updatedAt',
			pluginResources: 'id, pluginId',
			images: 'id'
		});
	}
}

export const db = new ChronosDB();
