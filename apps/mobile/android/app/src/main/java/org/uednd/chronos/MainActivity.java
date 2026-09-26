package org.uednd.chronos;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		registerPlugin(ChronosInstallationPlugin.class);
		super.onCreate(savedInstanceState);
		if (bridge != null && bridge.getWebView() != null) {
			bridge.getWebView().setHapticFeedbackEnabled(false);
		}
	}
}
