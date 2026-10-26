import Capacitor
import UIKit

@objc(ChronosInstallationPlugin)
public class ChronosInstallationPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ChronosInstallationPlugin"
    public let jsName = "ChronosInstallation"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getIdentity", returnType: CAPPluginReturnPromise)
    ]

    @objc func getIdentity(_ call: CAPPluginCall) {
        let bundle = Bundle.main
        call.resolve([
            "bundleId": bundle.bundleIdentifier ?? "",
            "version": bundle.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "",
            "build": bundle.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "",
            "osVersion": UIDevice.current.systemVersion
        ])
    }
}
