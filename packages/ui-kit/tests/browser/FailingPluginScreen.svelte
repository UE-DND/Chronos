<script lang="ts">
	let { fail = false, kind = 'effect' }: { fail?: boolean; kind?: 'effect' | 'render' } = $props();
	const content = $derived.by(() => {
		if (fail && kind === 'render') throw new Error('Intentional plugin render failure');
		return 'Course content';
	});
	$effect(() => {
		if (fail && kind === 'effect') throw new Error('Intentional plugin effect failure');
	});
</script>

<p>{content}</p>
