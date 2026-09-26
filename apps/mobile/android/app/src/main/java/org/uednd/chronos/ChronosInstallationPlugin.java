package org.uednd.chronos;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.security.MessageDigest;

@CapacitorPlugin(name = "ChronosInstallation")
public class ChronosInstallationPlugin extends Plugin {
    @PluginMethod
    @SuppressWarnings("deprecation")
    public void getIdentity(PluginCall call) {
        try {
            String packageId = getContext().getPackageName();
            PackageInfo info = getContext().getPackageManager().getPackageInfo(packageId,
                Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES);
            Signature[] signers = Build.VERSION.SDK_INT >= 28
                ? info.signingInfo.getApkContentsSigners() : info.signatures;
            if (signers == null || signers.length != 1) {
                call.reject("Expected a single Android signing identity");
                return;
            }
            byte[] bytes = MessageDigest.getInstance("SHA-256").digest(signers[0].toByteArray());
            StringBuilder certificate = new StringBuilder();
            for (byte value : bytes) certificate.append(String.format("%02x", value & 0xff));
            JSObject result = new JSObject();
            result.put("packageId", packageId);
            result.put("version", info.versionName);
            result.put("versionCode", Build.VERSION.SDK_INT >= 28 ? info.getLongVersionCode() : info.versionCode);
            result.put("signingCertificateSha256", certificate.toString());
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Cannot read Android installation identity", error);
        }
    }
}
