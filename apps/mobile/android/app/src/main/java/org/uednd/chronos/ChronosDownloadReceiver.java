package org.uednd.chronos;

import android.app.DownloadManager;
import android.content.*;

public class ChronosDownloadReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        if (!DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) return;
        // The ID is only a hint: the manager queries the system and checks the saved task.
        ChronosUpdateManager.get(context).downloadCompleted(intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1));
        ChronosUpdaterPlugin.changed();
    }
}
