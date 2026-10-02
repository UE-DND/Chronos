package org.uednd.chronos;

import static org.junit.Assert.*;
import org.junit.Test;

public class AndroidUpdateRulesTest {
    private static final String CERT = "c".repeat(64);
    private static final String HASH = "a".repeat(64);
    private AndroidUpdateRules.Artifact artifact(String url) {
        return new AndroidUpdateRules.Artifact("org.uednd.chronos", "1.0.3", 1000003,
            CERT, "chronos-default", HASH, HASH, 100, url);
    }
    private String url() { return "https://github.com/UE-DND/Chronos/releases/download/v1.0.3/Chronos-default-1.0.3.apk"; }
    private void expectFailure(String code, Runnable action) {
        try { action.run(); fail("Expected " + code); }
        catch (AndroidUpdateRules.Rejected error) { assertEquals(code, error.code); }
    }
    @Test public void onlyAcceptsPinnedOfficialArtifactsAndNewerVersions() {
        AndroidUpdateRules.validate(artifact(url()), "org.uednd.chronos", CERT, "chronos-default", 1000002);
        expectFailure("invalid_descriptor", () -> AndroidUpdateRules.validate(artifact(url().replace("UE-DND/Chronos", "other/repo")), "org.uednd.chronos", CERT, "chronos-default", 1000002));
        expectFailure("invalid_descriptor", () -> AndroidUpdateRules.validate(artifact(url() + "?download=1"), "org.uednd.chronos", CERT, "chronos-default", 1000002));
        expectFailure("version_conflict", () -> AndroidUpdateRules.validate(artifact(url()), "org.uednd.chronos", CERT, "chronos-default", 1000003));
    }
    @Test public void rejectsPackageCertificateAndProfileMismatch() {
        expectFailure("package_mismatch", () -> AndroidUpdateRules.validate(artifact(url()), "other.app", CERT, "chronos-default", 1));
        expectFailure("signature_mismatch", () -> AndroidUpdateRules.validate(artifact(url()), "org.uednd.chronos", "f".repeat(64), "chronos-default", 1));
        expectFailure("profile_mismatch", () -> AndroidUpdateRules.validate(artifact(url()), "org.uednd.chronos", CERT, "chronos-cqut", 1));
    }
    @Test public void verifiesActualBytesAndPackagedHostIdentity() {
        expectFailure("integrity_mismatch", () -> AndroidUpdateRules.verifyBytes(artifact(url()), 99, HASH));
        expectFailure("integrity_mismatch", () -> AndroidUpdateRules.verifyBytes(artifact(url()), 100, "b".repeat(64)));
        expectFailure("profile_mismatch", () -> AndroidUpdateRules.verifyHost(artifact(url()), "mobile", "chronos-cqut", HASH, "1.0.3"));
        expectFailure("profile_mismatch", () -> AndroidUpdateRules.verifyHost(artifact(url()), "mobile", "chronos-default", "b".repeat(64), "1.0.3"));
        AndroidUpdateRules.verifyBytes(artifact(url()), 100, HASH);
        AndroidUpdateRules.verifyHost(artifact(url()), "mobile", "chronos-default", HASH, "1.0.3");
    }
    @Test public void rejectsActualApkIdentityMismatch() {
        expectFailure("package_mismatch", () -> AndroidUpdateRules.verifyPackage(artifact(url()), "other.app", "1.0.3", 1000003, CERT));
        expectFailure("version_conflict", () -> AndroidUpdateRules.verifyPackage(artifact(url()), "org.uednd.chronos", "1.0.2", 1000002, CERT));
        expectFailure("signature_mismatch", () -> AndroidUpdateRules.verifyPackage(artifact(url()), "org.uednd.chronos", "1.0.3", 1000003, "f".repeat(64)));
    }

}
