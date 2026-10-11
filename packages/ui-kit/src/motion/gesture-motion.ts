/** Recent pointer velocity, in px/ms; a held pointer has no release momentum. */
export function createGestureVelocity() {
	let samples: { position: number; time: number }[] = [];
	return {
		reset(position: number, time = performance.now()) {
			samples = [{ position, time }];
		},
		add(position: number, time = performance.now()) {
			const last = samples.at(-1);
			const prior = samples.at(-2);
			if (last && prior && (position - last.position) * (last.position - prior.position) < 0)
				samples = [last];
			if (last?.time === time) last.position = position;
			else samples.push({ position, time });
			while (samples.length > 1 && samples[0]!.time < time - 80) samples.shift();
		},
		velocity(time = performance.now()): number {
			const last = samples.at(-1);
			const first = samples[0];
			if (!first || !last || time - last.time > 80 || last.time <= first.time) return 0;
			return (last.position - first.position) / (last.time - first.time);
		}
	};
}

export function projectMomentum(velocity: number): number {
	return (velocity * 0.998) / (1 - 0.998);
}

export function rubberband(offset: number, dimension: number): number {
	return (offset * dimension * 0.55) / (dimension + Math.abs(offset) * 0.55);
}

/** Exact critically damped spring. Re-targeting preserves its live position and speed. */
export function createScalarSpring(onUpdate: (value: number) => void) {
	const omega = (2 * Math.PI) / 0.35;
	let value = 0;
	let velocity = 0;
	let frame = 0;
	let generation = 0;
	function cancel() {
		generation++;
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	}
	function jump(next: number) {
		cancel();
		value = next;
		velocity = 0;
		onUpdate(value);
	}
	return {
		get value() {
			return value;
		},
		get velocity() {
			return velocity;
		},
		get running() {
			return frame !== 0;
		},
		cancel,
		jump,
		animate(target: number, releaseVelocity = velocity, onComplete?: () => void) {
			cancel();
			velocity = releaseVelocity;
			const task = generation;
			const displacement = value - target;
			const coefficient = velocity * 1000 + omega * displacement;
			const started = performance.now();
			function step(now: number) {
				if (task !== generation) return;
				const t = Math.max(0, (now - started) / 1000);
				const decay = Math.exp(-omega * t);
				value = target + (displacement + coefficient * t) * decay;
				velocity = ((coefficient - omega * (displacement + coefficient * t)) * decay) / 1000;
				if ((Math.abs(value - target) < 0.1 && Math.abs(velocity) < 0.005) || t >= 2) {
					value = target;
					velocity = 0;
					frame = 0;
					onUpdate(value);
					if (task === generation) onComplete?.();
				} else {
					onUpdate(value);
					if (task === generation) frame = requestAnimationFrame(step);
				}
			}
			frame = requestAnimationFrame(step);
		}
	};
}
