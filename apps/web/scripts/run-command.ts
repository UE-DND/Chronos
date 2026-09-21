import { spawn } from 'node:child_process';
import { constants } from 'node:os';

export class CommandError extends Error {
	readonly exitCode: number;
	constructor(binary: string, status: number | null, signal: NodeJS.Signals | null) {
		super(`${binary} failed (${signal ?? status})`);
		this.exitCode = signal ? 128 + constants.signals[signal] : status || 1;
	}
}

/** A cancelled child must never advance the host to its next preparation/build stage. */
export async function runCommand(binary: string, argv: string[], cwd: string): Promise<void> {
	const grouped = process.platform !== 'win32';
	const child = spawn(binary, argv, { cwd, env: process.env, stdio: 'inherit', detached: grouped });
	let interrupted: NodeJS.Signals | null = null;
	let deadline: NodeJS.Timeout | undefined;
	const forward = (signal: NodeJS.Signals) => {
		try {
			if (grouped && child.pid) process.kill(-child.pid, signal);
			else child.kill(signal);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error;
		}
	};
	const stop = (signal: NodeJS.Signals) => {
		if (interrupted) {
			forward('SIGKILL');
			return;
		}
		interrupted = signal;
		forward(signal);
		deadline = setTimeout(() => forward('SIGKILL'), 5000);
		deadline.unref();
	};
	const onTerm = () => stop('SIGTERM');
	const onInt = () => stop('SIGINT');
	process.on('SIGTERM', onTerm);
	process.on('SIGINT', onInt);
	try {
		await new Promise<void>((done, reject) => {
			child.once('error', reject);
			child.once('close', (status, signal) => {
				if (interrupted || signal || status !== 0)
					reject(new CommandError(binary, status, interrupted ?? signal));
				else done();
			});
		});
	} finally {
		if (deadline) clearTimeout(deadline);
		process.off('SIGTERM', onTerm);
		process.off('SIGINT', onInt);
	}
}
