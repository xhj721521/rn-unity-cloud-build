# 技术架构概览

## 总体结构

```
┌──────────────────────────┐
│ React Native Shell       │
│  - UI / Navigation       │
│  - State (Redux/Zustand) │
│  - Web3 Services         │
│  - Unity Bridge (Native) │
└────────────┬─────────────┘
             │
             │ Native Bridge (Android/iOS)
             │
┌────────────▼─────────────┐
│ Unity Engine Module      │
│  - Game Scenes           │
│  - Gameplay Scripts      │
│  - ReactBridge.cs        │
└────────────┬─────────────┘
             │
             │ Chain Services / Backend
             │
┌────────────▼─────────────┐
│ Blockchain / APIs        │
└──────────────────────────┘
```

## React Native 层
- **主要责任**：导航、UI、链上数据展示与请求、账户管理。
- **模块划分**：Home（含排行榜/铸造坊/集市坊/活动商城子页）、Explore、Trials、On-chain Data、Profile（含我的团队/我的仓库/我的邀请子页）。
- **通信方式**：通过 NativeModule 暴露 `sendUnityMessage` / 事件订阅接口向 Unity 发送指令并接收回调。
- **状态管理**：推荐 Redux Toolkit + RTK Query 或 Zustand；链上数据缓存与重试逻辑统一管理。

## 原生桥接
- **Android**：使用 Activity/Fragment 容器承载 Unity Player；通过 `UnityPlayer` 与 RN Module 双向通信；支持后台保活与生命周期同步。
- **iOS**：集成 `UnityFramework`，管理 `UnityAppController`；使用 RCTBridgeModule 暴露 JS 接口，利用通知中心或 delegate 回传事件。
- **线程策略**：Unity 消息在原生工作线程处理，结果通过主线程 dispatch 到 RN，确保 UI 响应流畅。

## Unity 层
- **ReactBridge.cs**：封装 `SendToReact(string type, string payload)`，并监听原生注入的回调。
- **资源管理**：使用 Addressables/AssetBundle 管理大型资源，按需加载；占位阶段使用简化资源。
- **链上交互**：通过桥接接收入参（如角色属性、链上状态），运算完成后回传结果；关键事件包含 `SCENE_READY`、`PLAY_RESULT`、`ERROR`。
- **性能**：持续监控 FPS、内存、GC；对动画、粒子、Shader 做移动端优化。

## 通信协议
- **消息格式**：`{ "type": "PLAY_START", "requestId": "...", "payload": { ... } }`
- **可靠性**：RN 端维持消息队列与重试机制，重要操作需 Unity 回 ACK；Unity 异常时触发回退逻辑。
- **序列化**：统一使用 JSON，必要时对 payload 进行压缩；后续可扩展 ProtoBuf。

## 链上服务
- **实现方式**：在 RN 中封装 web3 SDK（如 ethers.js、viem），通过 hooks 暴露数据。
- **缓存策略**：对静态数据（NFT、角色配置）使用本地缓存 + 版本号；动态数据（余额）实时刷新并提供手动刷新入口。
- **安全**：钱包签名流程需在 RN 层实现；Unity 仅处理结果展示与玩法逻辑。

## 占位与过渡
- RN 显示 Unity 载入前的骨架屏或动画；Unity 准备就绪后发送 `SCENE_READY`。
- 在 Unity 退场时，先展示 RN 过渡界面，再释放 Unity 资源，避免黑屏。

