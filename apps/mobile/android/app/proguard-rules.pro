# Capacitor's consumer rules retain plugin classes and reflective plugin methods,
# including ChronosInstallationPlugin and ChronosWidgetPlugin. Android's default
# rules retain JavascriptInterface methods; AAPT retains manifest/widget entries.

# R8 full mode must retain the annotation types themselves, not only annotated
# plugins/methods. Otherwise it folds PluginHandle's permission annotation to null,
# and Android 13+ LocalNotifications.checkPermissions() resolves undefined.
-keep @interface com.getcapacitor.annotation.** { *; }
