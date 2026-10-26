import Capacitor
import CryptoKit
import Foundation

@objc(ChronosIosPackagePlugin)
public class ChronosIosPackagePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ChronosIosPackagePlugin"
    public let jsName = "ChronosIosPackage"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "download", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise)
    ]

    private var active: PackageDownload?

    @objc func download(_ call: CAPPluginCall) {
        guard let rawURL = call.getString("url"),
              let expected = call.getString("sha256")?.lowercased(),
              expected.range(of: "^[0-9a-f]{64}$", options: .regularExpression) != nil,
              let url = URL(string: rawURL),
              Self.isPinnedRelease(url) else {
            call.reject("Invalid iOS package URL")
            return
        }
        active?.cancel()
        let destination = FileManager.default.temporaryDirectory.appendingPathComponent("Chronos-\(expected).ipa")
        let download = PackageDownload(plugin: self, call: call, expected: expected, destination: destination)
        active = download
        download.start(url)
    }

    @objc func cancel(_ call: CAPPluginCall) {
        active?.cancel()
        active = nil
        call.resolve()
    }

    fileprivate func complete(_ download: PackageDownload) {
        if active === download {
            active = nil
        }
    }

    fileprivate func emit(phase: String, percent: Int?) {
        var data: [String: Any] = ["phase": phase]
        if let percent {
            data["percent"] = percent
        }
        notifyListeners("progress", data: data)
    }

    private static func isPinnedRelease(_ url: URL) -> Bool {
        guard url.scheme == "https",
              url.host == "github.com",
              url.user == nil,
              url.password == nil,
              url.port == nil,
              url.query == nil,
              url.fragment == nil else {
            return false
        }
        let pattern = #"^/UE-DND/Chronos/releases/download/v[0-9]+\.[0-9]+\.[0-9]+/Chronos-[A-Za-z0-9-]+-[0-9]+\.[0-9]+\.[0-9]+\.ipa$"#
        return url.path.range(of: pattern, options: .regularExpression) != nil
    }
}

private final class PackageDownload: NSObject, URLSessionDownloadDelegate {
    private weak var plugin: ChronosIosPackagePlugin?
    private let call: CAPPluginCall
    private let expected: String
    private let destination: URL
    private var session: URLSession?
    private var task: URLSessionDownloadTask?
    private var status = 0
    private var moved = false
    private var canceled = false
    private var completed = false

    init(plugin: ChronosIosPackagePlugin, call: CAPPluginCall, expected: String, destination: URL) {
        self.plugin = plugin
        self.call = call
        self.expected = expected
        self.destination = destination
    }

    func start(_ url: URL) {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 60
        configuration.timeoutIntervalForResource = 600
        let session = URLSession(configuration: configuration, delegate: self, delegateQueue: nil)
        self.session = session
        let task = session.downloadTask(with: url)
        self.task = task
        task.resume()
    }

    func cancel() {
        canceled = true
        task?.cancel()
    }

    private func finish() {
        guard !completed else { return }
        completed = true
        session?.finishTasksAndInvalidate()
        if let plugin {
            plugin.complete(self)
        }
    }

    func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didWriteData bytesWritten: Int64,
        totalBytesWritten: Int64,
        totalBytesExpectedToWrite: Int64
    ) {
        guard !canceled else { return }
        let percent = totalBytesExpectedToWrite > 0
            ? Int(totalBytesWritten * 100 / totalBytesExpectedToWrite)
            : nil
        DispatchQueue.main.async {
            self.plugin?.emit(phase: "downloading", percent: percent)
        }
    }

    func urlSession(
        _ session: URLSession,
        downloadTask: URLSessionDownloadTask,
        didFinishDownloadingTo location: URL
    ) {
        guard !canceled else { return }
        status = (downloadTask.response as? HTTPURLResponse)?.statusCode ?? 0
        guard status == 200 else { return }
        do {
            if FileManager.default.fileExists(atPath: destination.path) {
                try FileManager.default.removeItem(at: destination)
            }
            try FileManager.default.moveItem(at: location, to: destination)
            moved = true
        } catch {
            status = -1
        }
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        defer { finish() }
        if canceled || (error as NSError?)?.code == NSURLErrorCancelled {
            call.reject("download canceled")
            return
        }
        if error != nil || status != 200 || !moved {
            call.reject("download failed")
            return
        }
        plugin?.emit(phase: "verifying", percent: nil)
        do {
            let digest = try sha256File(destination)
            guard digest == expected else {
                try? FileManager.default.removeItem(at: destination)
                call.reject("integrity mismatch")
                return
            }
            call.resolve([
                "uri": destination.absoluteString,
                "sha256": digest
            ])
        } catch {
            call.reject("integrity mismatch")
        }
    }
}

private func sha256File(_ url: URL) throws -> String {
    let handle = try FileHandle(forReadingFrom: url)
    defer { try? handle.close() }
    var hasher = SHA256()
    while true {
        let chunk = try handle.read(upToCount: 1024 * 1024) ?? Data()
        if chunk.isEmpty { break }
        hasher.update(data: chunk)
    }
    return hasher.finalize().map { String(format: "%02x", $0) }.joined()
}
