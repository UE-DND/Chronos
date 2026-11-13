import { immutableSnapshot, type ChronosContext } from '@chronos/core';
import type { ChronosUiView } from '../reactivity/chronos-ui-controller';

export interface ImportTabTransferController {
	readonly state: {
		readonly errorMessage: string | null;
	};
	previewWithSlot(tabId: string, inputs: Record<string, unknown>): Promise<boolean>;
}

export interface ImportTabComponentProps {
	controller: ChronosUiView;
	context: ChronosContext;
	transfer: ImportTabTransferController;
	onContinue: () => void;
}

export async function previewAndNotify(
	transfer: ImportTabTransferController,
	tabId: string,
	inputs: Record<string, unknown>,
	context: Pick<ChronosContext, 'actions'>
): Promise<boolean> {
	const ok = await transfer.previewWithSlot(tabId, inputs);
	if (!ok && transfer.state.errorMessage) {
		context.actions.notify(transfer.state.errorMessage, 'error');
	}
	return ok;
}

/** The selected source may preview its own input, without accessing the host transfer controller. */
export function createImportTabTransfer(
	transfer: ImportTabTransferController,
	tabId: string,
	context: Pick<ChronosContext, 'signal'>
): ImportTabTransferController {
	return Object.freeze({
		get state() {
			return Object.freeze({ errorMessage: transfer.state.errorMessage });
		},
		previewWithSlot(id: string, inputs: Record<string, unknown>) {
			if (context.signal.aborted) return Promise.reject(new Error('Plugin instance stopped'));
			if (id !== tabId) return Promise.reject(new Error('Import source does not own this tab'));
			return transfer.previewWithSlot(tabId, inputs);
		}
	});
}

export function createImportConfirmTransfer(
	transfer: {
		readonly state: { readonly confirmInputs: Record<string, unknown> };
		setConfirmInputs(inputs: Record<string, unknown>): void;
	},
	context: Pick<ChronosContext, 'signal'>
) {
	return Object.freeze({
		get state() {
			return immutableSnapshot({ confirmInputs: transfer.state.confirmInputs });
		},
		setConfirmInputs(inputs: Record<string, unknown>) {
			if (context.signal.aborted) throw new Error('Plugin instance stopped');
			transfer.setConfirmInputs(inputs);
		}
	});
}
