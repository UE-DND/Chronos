import Capacitor
import WebKit

class ChronosViewController: CAPBridgeViewController {
    private var splashHidden = false
    private var readyTimer: Timer?

    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(ChronosInstallationPlugin())
        bridge?.registerPluginInstance(ChronosIosPackagePlugin())
        bridge?.registerPluginInstance(ChronosHttpCookiePlugin())
        DispatchQueue.main.asyncAfter(deadline: .now() + 40) { [weak self] in
            self?.hideStartupSplash()
        }
        readyTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.checkStartupDisplay()
        }
    }

    deinit {
        readyTimer?.invalidate()
    }

    private func checkStartupDisplay() {
        guard !splashHidden, let webView else { return }
        webView.evaluateJavaScript("window.__chronosStartupDisplayReady === true") { [weak self] result, _ in
            let ready = (result as? Bool) == true || (result as? NSNumber)?.boolValue == true
            if ready {
                self?.hideStartupSplash()
            }
        }
    }

    private func hideStartupSplash() {
        guard !splashHidden else { return }
        splashHidden = true
        readyTimer?.invalidate()
        let call = CAPPluginCall(
            callbackId: "splash-deadline",
            methodName: "hide",
            options: [:],
            success: { _, _ in },
            error: { _ in }
        )
        guard let splash = bridge?.plugin(withName: "SplashScreen"),
              splash.responds(to: Selector(("hide:"))) else {
            return
        }
        splash.perform(Selector(("hide:")), with: call)
    }
}
