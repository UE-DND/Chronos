package org.uednd.chronos;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.net.Uri;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginHandle;
import com.getcapacitor.WebViewListener;
import com.capacitorjs.plugins.splashscreen.SplashScreenPlugin;

public class MainActivity extends BridgeActivity {
	private final Handler startupHandler = new Handler(Looper.getMainLooper());
	private final Runnable splashDeadline = this::hideStartupSplash;
	private final Runnable splashReadyCheck = this::checkStartupDisplay;
	private boolean startupSplashHidden;

	private void checkStartupDisplay() {
		if (startupSplashHidden || bridge == null || bridge.getWebView() == null) return;
		// Read readiness directly, independently of the native plugin call queue.
		bridge.getWebView().evaluateJavascript("window.__chronosStartupDisplayReady === true", result -> {
			if (startupSplashHidden) return;
			if ("true".equals(result)) hideStartupSplash();
			else startupHandler.postDelayed(splashReadyCheck, 100);
		});
	}

	private void hideStartupSplash() {
		if (startupSplashHidden || bridge == null) return;
		PluginHandle handle = bridge.getPlugin("SplashScreen");
		if (handle == null || !(handle.getInstance() instanceof SplashScreenPlugin)) return;
		startupSplashHidden = true;
		startupHandler.removeCallbacks(splashDeadline);
		startupHandler.removeCallbacks(splashReadyCheck);
		// Run on the main thread, independently of a stalled native plugin call queue.
		((SplashScreenPlugin) handle.getInstance()).hide(new PluginCall(
			null, "SplashScreen", PluginCall.CALLBACK_ID_DANGLING, "hide", new JSObject()
		) {
			@Override public void resolve() { /* Native-only call, without a JavaScript callback. */ }
		});
	}

	@Override
	public void onDestroy() {
		startupSplashHidden = true;
		startupHandler.removeCallbacksAndMessages(null);
		super.onDestroy();
	}
	@Override
	public void onCreate(Bundle savedInstanceState) {
		registerPlugin(ChronosInstallationPlugin.class);
		registerPlugin(ChronosUpdaterPlugin.class);
		registerPlugin(ChronosWidgetPlugin.class);
		registerPlugin(ChronosClassNotificationsPlugin.class);
		super.onCreate(savedInstanceState);
		// Allow the core (25s) and plugin (10s) deadlines to reveal their error UI first.
		startupHandler.postDelayed(splashDeadline, 40000);
		if (bridge != null && bridge.getWebView() != null) {
			bridge.getWebView().setHapticFeedbackEnabled(false);
			bridge.addWebViewListener(new WebViewListener() {
				@Override
				public void onPageLoaded(WebView webView) {
					String loaded = webView.getUrl();
					if (loaded == null) return;
					Uri url = Uri.parse(loaded);
					Uri app = Uri.parse(bridge.getAppUrl());
					if (loaded.equals(bridge.getErrorUrl())) {
						hideStartupSplash();
					} else if (app.getScheme().equals(url.getScheme()) && app.getAuthority().equals(url.getAuthority())) {
						startupHandler.removeCallbacks(splashReadyCheck);
						checkStartupDisplay();
					}
				}
			});
		}
	}
}
