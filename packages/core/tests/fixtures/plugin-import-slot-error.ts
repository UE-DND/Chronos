/** Mirrors the error class carried by a self-contained plugin bundle. */
export class ImportSlotError extends Error {
	constructor(
		readonly kind: string,
		message: string
	) {
		super(message);
		this.name = 'ImportSlotError';
	}
}
