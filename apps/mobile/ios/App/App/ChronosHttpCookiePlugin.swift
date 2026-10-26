import Capacitor
import Foundation

/// Reports whether URLSession stored a cookie, including HttpOnly cookies that
/// CapacitorCookies omits and that iOS may not echo in Set-Cookie.
@objc(ChronosHttpCookiePlugin)
public class ChronosHttpCookiePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ChronosHttpCookiePlugin"
    public let jsName = "ChronosHttpCookie"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "hasCookie", returnType: CAPPluginReturnPromise)
    ]

    @objc func hasCookie(_ call: CAPPluginCall) {
        guard let rawURL = call.getString("url"),
              let name = call.getString("name"),
              !name.isEmpty,
              let url = URL(string: rawURL),
              url.scheme == "https",
              url.host != nil else {
            call.reject("Invalid cookie query")
            return
        }
        let cookies = HTTPCookieStorage.shared.cookies(for: url) ?? []
        call.resolve(["present": cookies.contains { $0.name == name }])
    }
}
