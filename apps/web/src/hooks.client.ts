import { ensurePwaSwRegistered } from '$lib/client/pwa-sw';
import { initAppUpdateUx } from '$lib/client/app-update-ux.svelte';
import { getHostPlatform } from '$lib/platform/host-platform';
import '$lib/client/pwa-install.svelte';

if (getHostPlatform().getUpdateAction?.().mode === 'service-worker') ensurePwaSwRegistered();
initAppUpdateUx();
