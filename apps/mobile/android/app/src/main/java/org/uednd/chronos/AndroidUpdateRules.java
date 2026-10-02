package org.uednd.chronos;

/** Pure artifact rules shared by native entry validation and APK inspection. */
final class AndroidUpdateRules {
    static final class Rejected extends RuntimeException {
        final String code;
        Rejected(String code) { super(code); this.code = code; }
    }
    static final class Artifact {
        final String packageId, version, certificate, profileId, buildId, sha256, url;
        final long versionCode, size;
        Artifact(String packageId, String version, long versionCode, String certificate,
                 String profileId, String buildId, String sha256, long size, String url) {
            this.packageId = packageId; this.version = version; this.versionCode = versionCode;
            this.certificate = certificate; this.profileId = profileId; this.buildId = buildId;
            this.sha256 = sha256; this.size = size; this.url = url;
        }
    }
    static void require(boolean condition, String code) {
        if (!condition) throw new Rejected(code);
    }
    static long versionCode(String version) {
        require(version != null && version.matches("(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)"), "version_conflict");
        try {
            String[] parts = version.split("\\.");
            long major = Long.parseLong(parts[0]), minor = Long.parseLong(parts[1]), patch = Long.parseLong(parts[2]);
            require(major <= 2100 && minor <= 999 && patch <= 999, "version_conflict");
            long code = major * 1000000 + minor * 1000 + patch;
            require(code > 0 && code <= 2100000000, "version_conflict");
            return code;
        } catch (NumberFormatException error) { throw new Rejected("version_conflict"); }
    }
    static void validate(Artifact artifact, String installedPackage, String installedCertificate,
                         String installedProfile, long installedCode) {
        require(artifact.packageId.equals(installedPackage), "package_mismatch");
        require(artifact.certificate.matches("[a-f0-9]{64}") && artifact.certificate.equals(installedCertificate), "signature_mismatch");
        require(artifact.profileId.equals(installedProfile), "profile_mismatch");
        require(artifact.versionCode == versionCode(artifact.version) && artifact.versionCode > installedCode, "version_conflict");
        require(artifact.profileId.matches("chronos-(default|cqut|cqut-offline)") &&
            artifact.sha256.matches("[a-f0-9]{64}") && artifact.buildId.matches("[a-f0-9]{64}") && artifact.size > 0,
            "invalid_descriptor");
        String expected = "https://github.com/UE-DND/Chronos/releases/download/v" + artifact.version +
            "/Chronos-" + artifact.profileId.substring(8) + "-" + artifact.version + ".apk";
        require(expected.equals(artifact.url), "invalid_descriptor");
    }
    static void verifyBytes(Artifact artifact, long size, String sha256) {
        require(size == artifact.size && artifact.sha256.equals(sha256), "integrity_mismatch");
    }
    static void verifyHost(Artifact artifact, String target, String profile, String build, String version) {
        require("mobile".equals(target) && artifact.profileId.equals(profile) && artifact.buildId.equals(build), "profile_mismatch");
        require(artifact.version.equals(version), "version_conflict");
    }
    static void verifyPackage(Artifact artifact, String packageId, String version, long code, String certificate) {
        require(artifact.packageId.equals(packageId), "package_mismatch");
        require(artifact.version.equals(version) && artifact.versionCode == code, "version_conflict");
        require(artifact.certificate.equals(certificate), "signature_mismatch");
    }
}
