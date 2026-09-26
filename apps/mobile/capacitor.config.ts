import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'org.uednd.chronos',
	appName: 'Chronos',
	webDir: '../web/build',
	server: {
		androidScheme: 'https'
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
