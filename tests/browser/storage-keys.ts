import { PREFERENCE_STORAGE_KEYS as logicalKeys } from '../../packages/core/src/domain/preferences';
export const PREFERENCE_STORAGE_KEYS = Object.fromEntries(
	Object.entries(logicalKeys).map(([key, value]) => [key, 'chronos:/Chronos:' + value])
) as typeof logicalKeys;
