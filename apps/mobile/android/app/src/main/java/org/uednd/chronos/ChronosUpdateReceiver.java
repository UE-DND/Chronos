package org.uednd.chronos;

import android.content.*;
import android.content.pm.PackageInstaller;
import android.os.Build;

public class ChronosUpdateReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        ChronosUpdateManager manager = ChronosUpdateManager.get(context);
        if (Intent.ACTION_MY_PACKAGE_REPLACED.equals(intent.getAction())) {
            manager.snapshot(); ChronosUpdaterPlugin.changed(); return;
        }
        if (!"org.uednd.chronos.UPDATE_RESULT".equals(intent.getAction())) return;
        Intent confirmation = Build.VERSION.SDK_INT >= 33
            ? intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent.class) : intent.getParcelableExtra(Intent.EXTRA_INTENT);
        manager.installationResult(intent.getStringExtra("taskId"),
            intent.getIntExtra(PackageInstaller.EXTRA_SESSION_ID, -1),
            intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE), confirmation);
        ChronosUpdaterPlugin.installationChanged();
    }
}
