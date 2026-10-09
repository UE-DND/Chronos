import { ensurePwaSwRegistered } from '#lib/client/pwa-sw.ts';
import { initAppUpdateUx } from '#lib/client/app-update-ux.svelte.ts';
import { getHostPlatform } from '#lib/platform/host-platform.ts';
import '#lib/client/pwa-install.svelte.ts';

if (getHostPlatform().getUpdateAction?.().mode === 'service-worker') ensurePwaSwRegistered();
initAppUpdateUx();
