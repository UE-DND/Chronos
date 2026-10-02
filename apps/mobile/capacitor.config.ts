import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'org.uednd.chronos',
	appName: 'Chronos',
	webDir: '../web/build',
	android: {
		// Tailwind 4 needs Chromium 111; AbortSignal.any in app/plugins needs 116.
		minWebViewVersion: 116
	},
	server: {
		androidScheme: 'https',
		errorPath: 'webview-error.html'
	},
	plugins: {
		SplashScreen: {
			launchShowDuration: 2000,
			launchAutoHide: false,
			backgroundColor: '#00000000',
			showSpinner: false
		},
		StatusBar: {
			overlaysWebView: true
		}
	}
};

export default config;
