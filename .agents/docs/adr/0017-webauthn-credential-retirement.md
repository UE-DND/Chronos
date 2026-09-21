# ADR 0017: Web 端 WebAuthn 凭据存储功能废弃

- 状态：Accepted
- 日期：2026-08-22

## 决策与原因

WebAuthn PRF 的浏览器差异、认证步骤与降级逻辑不适合低频课表导入，因此移除 Web 保险箱及凭据迁移代码。Web 导入只在会话内使用教务密码，不持久化密码。

core 保留可选 `IVaultService` 契约，供原生宿主对接 Keychain / Keystore；Web 不提供该实现。本决策取代 [ADR 0006](0006-hardware-credential-vault-via-webauthn-prf.md) 的 Web 方案。
