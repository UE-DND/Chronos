# ADR 0002：服务容器与端口适配器

- 日期：2026-08-19

## 决策

宿主创建 `ChronosEngine` 时传入 `ChronosEnv`，向引擎提供存储、网络、哈希和可选平台能力。插件通过 `ctx.service` 或 `ctx.tryService` 获取服务。业务代码不依赖 Dexie、Fetch 或原生实现。

端口和环境的定义见 `packages/core/src/types/services.ts` 和 `env.ts`。调用方负责处理缺少可选能力的情况。`IVaultService` 只用于凭据，不是通用 KV。Web 实现已由 [ADR 0017](0017-webauthn-credential-retirement.md) 移除。

## 取舍

显式注入环境可以支持多个宿主和内存测试，也避免业务代码通过全局对象查找平台服务。插件数据的二进制语义见 [ADR 0036](0036-plugin-kv-binary-storage.md)。
