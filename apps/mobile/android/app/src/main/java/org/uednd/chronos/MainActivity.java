package org.uednd.chronos;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		registerPlugin(ChronosInstallationPlugin.class);
		registerPlugin(ChronosUpdaterPlugin.class);
		registerPlugin(ChronosWidgetPlugin.class);
		super.onCreate(savedInstanceState);
		if (bridge != null && bridge.getWebView() != null) {
			bridge.getWebView().setHapticFeedbackEnabled(false);
			bridge.addWebViewListener(new WebViewListener() {
				@Override
				public void onPageLoaded(WebView webView) {
					if (bridge.getErrorUrl() != null && bridge.getErrorUrl().equals(webView.getUrl())) {
						// Error pages have no JS bridge, so dismiss the persistent launch splash natively.
						bridge.callPluginMethod("SplashScreen", "hide", new PluginCall(
							null, "SplashScreen", PluginCall.CALLBACK_ID_DANGLING, "hide", new JSObject()
						) {
							@Override
							public void resolve() {
								// Native-only call: there is no JavaScript callback to resolve.
							}
						});
					}
				}
			});
		}
	}
}
