# ADR 0002: 服务容器与端口适配器架构 (Ports & Adapters)

- 状态：Accepted
- 日期：2026-08-19

## 决策

宿主在创建 `ChronosEngine` 时提供 `ChronosEnv`，将存储、网络、哈希及可选平台能力注入引擎。插件通过 `ctx.service` 或 `ctx.tryService` 获取服务；业务代码不依赖具体的 Dexie、Fetch 或原生实现。

端口和环境定义分别以 `packages/core/src/types/services.ts`、`env.ts` 为准。可选能力缺席由调用方处理；`IVaultService` 是凭据端口，不是通用 KV，Web 实现已由 [ADR 0017](0017-webauthn-credential-retirement.md) 移除。

## 取舍

用显式环境注入支持多宿主和内存测试，避免业务代码通过全局对象寻找平台服务。插件数据的二进制语义见 [ADR 0036](0036-plugin-kv-binary-storage.md)。
