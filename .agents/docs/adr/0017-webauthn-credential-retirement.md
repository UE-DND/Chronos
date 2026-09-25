# ADR 0017：Web 不持久化教务凭据

- 状态：Accepted
- 日期：2026-08-22

## 决策与原因

浏览器对 WebAuthn PRF 的支持有差异。认证步骤和降级逻辑也不适合低频课表导入。因此，项目移除了 Web 保险箱和凭据迁移代码。Web 导入只在当前会话中使用教务密码，不会持久化密码。

`core` 保留可选的 `IVaultService` 契约，供原生宿主接入 Keychain 或 Keystore。Web 不实现该接口。本决策取代 [ADR 0006](0006-hardware-credential-vault-via-webauthn-prf.md) 的 Web 方案。
