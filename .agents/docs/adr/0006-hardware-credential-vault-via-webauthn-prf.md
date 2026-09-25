# ADR 0006：WebAuthn 凭据保险箱（已废弃）

- 状态：Superseded（Web 实现由 ADR 0017 取代）
- 日期：2026-08-20

## 历史决策

早期方案使用 WebAuthn PRF 派生密钥，在 Web 端保存加密后的教务凭据。浏览器支持情况和认证步骤不适合低频导入场景，因此项目已移除实现和迁移代码。

当前决策见 [ADR 0017](0017-webauthn-credential-retirement.md)。Web 不会持久化教务密码。`core` 只保留可选的 `IVaultService`，供原生宿主实现。
