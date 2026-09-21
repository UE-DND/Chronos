# ADR 0006: 基于 WebAuthn PRF 与硬件安全的凭据保险箱 (IVaultService)

- 状态：Superseded（Web 实现由 ADR 0017 取代）
- 日期：2026-08-20

## 历史决策

曾通过 WebAuthn PRF 派生密钥，在 Web 端保存加密教务凭据。浏览器支持和认证交互成本不适合低频导入场景，现已移除实现及迁移代码。

现行决策见 [ADR 0017](0017-webauthn-credential-retirement.md)：Web 不持久化教务密码；core 仅保留可选 `IVaultService`，供原生宿主实现。
