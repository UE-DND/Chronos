export type AppError =
	| { kind: 'Validation'; message: string; cause?: unknown }
	| { kind: 'Auth'; message: string; cause?: unknown }
	| { kind: 'Network'; message: string; cause?: unknown }
	| { kind: 'DataFormat'; message: string; cause?: unknown }
	| { kind: 'Security'; message: string; cause?: unknown }
	| { kind: 'NotFound'; message: string; cause?: unknown }
	| { kind: 'Unknown'; message: string; cause?: unknown };

export const AppError = {
	validation(message: string, cause?: unknown): AppError {
		return { kind: 'Validation', message, ...(cause === undefined ? {} : { cause }) };
	},
	auth(message: string, cause?: unknown): AppError {
		return { kind: 'Auth', message, ...(cause === undefined ? {} : { cause }) };
	},
	network(message: string, cause?: unknown): AppError {
		return { kind: 'Network', message, ...(cause === undefined ? {} : { cause }) };
	},
	dataFormat(message: string, cause?: unknown): AppError {
		return { kind: 'DataFormat', message, ...(cause === undefined ? {} : { cause }) };
	},
	security(message: string, cause?: unknown): AppError {
		return { kind: 'Security', message, ...(cause === undefined ? {} : { cause }) };
	},
	notFound(message: string, cause?: unknown): AppError {
		return { kind: 'NotFound', message, ...(cause === undefined ? {} : { cause }) };
	},
	unknown(message: string, cause?: unknown): AppError {
		return { kind: 'Unknown', message, cause };
	}
};

export type AppResult<T> = { ok: true; value: T } | { ok: false; error: AppError };

export function success<T>(value: T): AppResult<T> {
	return { ok: true, value };
}

export function failure(error: AppError): AppResult<never> {
	return { ok: false, error };
}
