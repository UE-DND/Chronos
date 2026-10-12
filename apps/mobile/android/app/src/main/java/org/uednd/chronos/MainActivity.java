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
	private boolean startupSplashHidden;

	private void hideStartupSplash() {
		if (startupSplashHidden || bridge == null) return;
		PluginHandle handle = bridge.getPlugin("SplashScreen");
		if (handle == null || !(handle.getInstance() instanceof SplashScreenPlugin)) return;
		startupSplashHidden = true;
		startupHandler.removeCallbacks(splashDeadline);
		// Run on the main thread, independently of a stalled native plugin call queue.
		((SplashScreenPlugin) handle.getInstance()).hide(new PluginCall(
			null, "SplashScreen", PluginCall.CALLBACK_ID_DANGLING, "hide", new JSObject()
		) {
			@Override public void resolve() { /* Native-only call, without a JavaScript callback. */ }
		});
	}

	@Override
	public void onDestroy() {
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
		startupHandler.postDelayed(splashDeadline, 8000);
		if (bridge != null && bridge.getWebView() != null) {
			bridge.getWebView().setHapticFeedbackEnabled(false);
			bridge.addWebViewListener(new WebViewListener() {
				@Override
				public void onPageLoaded(WebView webView) {
					String loaded = webView.getUrl();
					if (loaded == null) return;
					Uri url = Uri.parse(loaded);
					Uri app = Uri.parse(bridge.getAppUrl());
					if ((app.getScheme().equals(url.getScheme()) && app.getAuthority().equals(url.getAuthority())) ||
						loaded.equals(bridge.getErrorUrl())) hideStartupSplash();
				}
			});
		}
	}
}
