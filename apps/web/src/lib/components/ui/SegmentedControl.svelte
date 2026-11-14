<script lang="ts">
	import {
		SegmentedControl as UiSegmentedControl,
		type SegmentedControlSegment as Segment
	} from '@chronos/ui-kit';

	let {
		segments,
		value,
		onValueChange,
		class: className = '',
		semantics = 'tabs',
		ariaLabel
	}: {
		segments: Segment[];
		value: string;
		onValueChange: (value: string) => void;
		class?: string;
		semantics?: 'tabs' | 'options';
		ariaLabel?: string;
	} = $props();
</script>

<UiSegmentedControl {segments} {value} {onValueChange} {semantics} {ariaLabel} class={className} />
