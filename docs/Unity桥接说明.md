# Unity ↔ React Native 消息桥设计

## 目标与当前状态
- 统一 React Native 与 Unity 的双向通信协议，支持指令发送、事件回传与状态同步。
- 兼容 Android（Unity AAR）与 iOS（UnityFramework），降低跨平台差异。
- 支持 Mock 调试，后续替换为真实 Unity / 原生实现。
- **当前进展**
  - JS 端桥接（`unityBridge.ts` / `useUnityBridge.ts` / `UnityView.tsx`）已可运行，未接入原生时会输出 Mock 日志。
  - Unity 占位脚本 `ReactBridge.cs` 已提供常见指令处理。
  - 原生模块（Android `UnityBridgeModule`、iOS `UnityBridge`）尚待实现。

## 消息格式
```jsonc
{
  "type": "START_COMBAT",
  "requestId": "uuid",
  "payload": {
    "loadout": "default",
    "difficulty": "normal"
  }
}
```
- `type`：指令或事件标识，统一使用大写蛇形命名。
- `requestId`：可选，用于追踪请求-响应。
- `payload`：JSON 业务数据，建议保持扁平、可扩展。

## React Native 侧
- 参考文件：`apps/mobile/src/bridge/unityBridge.ts`、`useUnityBridge.ts`、`UnityView.tsx`。
- 已实现能力：
  - `initUnity()`：初始化 Unity（Mock 状态下记录日志）。
  - `sendUnityMessage(type, payload)`：发送指令。
  - `addUnityListener`：监听 Unity 回传事件并自动解析 JSON。
- 原生模块计划：
  - Android：实现 `UnityBridgeModule`，在 `UIManager` 中注册 `UnityView`。
  - iOS：实现 `UnityBridge`（继承 `RCTEventEmitter`），以及 `UnityViewManager`。
- 约定：关键事件需返回 `ACK`；异常通过 `ERROR` 回传。

## Unity 侧
- 参考脚本：`apps/unity/Assets/Scripts/ReactBridge.cs`。
- 主要方法：
  - `OnReactMessage(string messageJson)`：处理来自 RN 的 JSON 指令。
  - `SendToReact(string type, string payloadJson)`：向 RN 发送事件。
- 场景命名：
  - `TrialsArena`：试炼模块。
  - `ExploreHub`：探索模块。
  - `BlindBoxShowcase`：首页盲盒展示。
  - `PlaceholderScene`：默认占位场景。
- 指令示例：
  - 试炼：`INIT_SCENE`、`START_COMBAT`、`PAUSE`
  - 探索：`LOAD_MAP`、`SCAN_RESOURCES`、`WARP_TO_EVENT`
  - 首页：`SHOW_BLINDBOX`

## 平台集成计划
### Android
1. 导入 Unity 导出的 `unityLibrary`，更新 `settings.gradle` 与 `app/build.gradle`。
2. 实现 `UnityBridgeModule`：
   - `@ReactMethod initUnity(promise)`：启动 `UnityPlayerActivity` 或 Fragment。
   - `@ReactMethod sendMessage(type, payload)`：调用 `UnityPlayer.UnitySendMessage`。
   - 通过 `DeviceEventManagerModule.RCTDeviceEventEmitter` 发送 `UnityMessage`。
3. 实现 `UnityViewManager`，使用 `SurfaceView`/`TextureView` 承载 Unity。
4. 同步生命周期：实现 `onHostResume`、`onHostPause`、`onHostDestroy`。

### iOS
1. 在 Xcode 中集成 `UnityFramework.framework` 与 Data 资源。
2. 实现 `UnityBridge`（继承 `RCTEventEmitter`）：
   - `initUnity`：启动 UnityFramework 并保持单例。
   - `sendMessage`：调用 `UnityFrameworkSendMessage`。
   - 通过 `[self sendEventWithName:@"UnityMessage" body:...]` 回传事件。
3. 实现 `UnityViewManager`，返回承载 Unity 渲染的 `UIView`。
4. 处理前后台切换（AppDelegate、通知中心等）。

## 调试与日志
- 开发阶段可使用 JS Mock 观察消息流。
- 推荐在指令中携带 `requestId`，记录发送/接收时间。
- Unity 侧可添加调试面板显示 FPS、内存、消息计数；RN 侧通过 `console.log` 或自定义 Logger。
- Android 查看日志：`adb logcat ReactNative:V Unity:V`；iOS 使用 Xcode `Debug > Open System Log…`。

### Unity 导出 Checklist（第一版）
- [ ] 在 Unity 中创建并验证以下占位场景：`PlaceholderScene`、`TrialsArena`、`ExploreHub`、`BlindBoxShowcase`。
- [ ] 将 `ReactBridge` 绑定到常驻物体，确保 `DontDestroyOnLoad` 生效。
- [ ] Android 导出时启用 `Export Project`，生成 `unityLibrary`，检查 `build.gradle` 与 `AndroidManifest.xml`。
- [ ] iOS 导出时保留 `UnityFramework.framework` 与 Data 目录，记录所需链接设置。
- [ ] 与 RN 团队确认指令 / 事件字段，为后续桥接实现提供 JSON 示例。

## 下一步待办
- [ ] Android：实现 `UnityBridgeModule` 与 `UnityViewManager`，验证 `INIT_SCENE → SCENE_READY` 流程。（当前已创建 Kotlin stub，待接入 UnityPlayer）
- [ ] iOS：集成 `UnityFramework`，实现 `UnityBridge` 与 `UnityViewManager`。
- [ ] Unity：完善 `ReactBridge` 日志与错误处理，确认所有事件类型。
- [ ] JS：在 `useUnityBridge` 中增加 `requestScene` 超时和错误重试处理。
