package org.uednd.chronos;

import android.util.AtomicFile;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

@CapacitorPlugin(name = "ChronosWidget")
public class ChronosWidgetPlugin extends Plugin {
	private final Object writeLock = new Object();

	@PluginMethod
	public void updateSnapshot(PluginCall call) {
		try {
			JSONObject snapshot = call.getObject("snapshot");
			if (snapshot == null || snapshot.optInt("version", -1) != 1) {
				call.reject("Invalid Today widget snapshot");
				return;
			}

			File file = new File(getContext().getFilesDir(), "today_widget_snapshot.json");
			AtomicFile atomicFile = new AtomicFile(file);
			synchronized (writeLock) {
				FileOutputStream output = null;
				try {
					output = atomicFile.startWrite();
					output.write(snapshot.toString().getBytes(StandardCharsets.UTF_8));
					atomicFile.finishWrite(output);
				} catch (Exception error) {
					if (output != null) atomicFile.failWrite(output);
					throw error;
				}
			}

			TodayAppWidgetProvider.updateAllWidgets(getContext());
			call.resolve();
		} catch (Exception error) {
			call.reject("Failed to update Today widget snapshot", error);
		}
	}
}
