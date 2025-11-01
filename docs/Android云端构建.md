# 云端 Android 构建指引

> 适用于当前 GitHub Actions 工作流 `.github/workflows/android.yml`。所有配置以 2025-10-31 最新提交为准，如有调整请同步更新本文。

## 1. 构建触发与代码来源

- 触发方式：`main` 分支 push / merge 或手动触发 `workflow_dispatch`。
- Actions 会在全新的 Ubuntu Runner 上执行，始终使用远端仓库的最新提交；本地未提交的修改不会参与构建。

## 2. 环境准备

- Node.js：**20.x**（`actions/setup-node@v4`）。React Native 0.75 的 Metro 依赖 ES2023 API（`Array.prototype.toReversed`），低于 20 会导致 Bundler 报错。
- Java：Temurin JDK 17。
- Android 组件：`platform-tools`、`platforms;android-34`、`build-tools;34.0.0`、`ndk;25.2.9519653`。Gradle Wrapper 由仓库提供，禁止 Runner 自行下载其他版本。

## 3. 缓存策略

| 缓存项 | 说明 |
| --- | --- |
| `~/.gradle/caches`, `~/.gradle/wrapper` | `actions/cache` 以 `apps/mobile/android/**/*.gradle*` 与 `gradle-wrapper.properties` 的 hash 作为 key。Gradle 依赖或插件版本不变即可命中。 |
| npm 依赖 | `setup-node` 的 `cache: 'npm'` 使用 `apps/mobile/package-lock.json`，lockfile 不变时无需重新下载。 |

## 4. 构建前置步骤

1. `npm ci`（目录：`apps/mobile`）—— 使用 lockfile 安装依赖。
2. `npx react-native config` —— 生成 `android/build/generated/autolinking/autolinking.json`，供 RN Gradle 插件读取。
3. **调试 keystore 自动生成** —— 工作流中加入 “Ensure debug keystore” 步骤，若 `~/.android/debug.keystore` 缺失，会自动调用 `keytool` 使用标准参数创建，避免 `:app:validateSigningDebug` 失败。
4. Gradle 构建命令：`./gradlew assembleDebug --info --stacktrace`。
5. Debug APK 的 `JS bundle` 已开启（在 `app/build.gradle` 中 `react { debuggableVariants = [] }`），因此生成的 APK 可离线运行，不再依赖 Metro。

## 5. 构建产物

- 输出文件：`apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`。
- 上传 Artifact：`android-debug-apk`。
- 当前 Debug 包体积约 170 MB，包含所有 ABI 与调试资源；发布前需改用 Release 构建并开启 ABI split / 资源压缩。

## 6. 常见问题与解决方案

| 问题 | 排查与解决 |
| --- | --- |
| `TypeError: configs.toReversed is not a function` | Node 版本过低。确保工作流使用 Node ≥ 20。 |
| `:app:validateSigningDebug` 找不到 keystore | 检查自动生成步骤是否被删除；也可在本地预先提交自定义 keystore（不推荐）。 |
| `Invariant Violation: "<name>" has not been registered` | 确认 `app.json` 的 `name` 与 `MainActivity.getMainComponentName()` 返回值一致（当前应为 `RNGameShell`）。 |
| `Cannot read property 'bubblingEventTypes' of null` | Unity 原生 View 未实现。JS 端 `UnityView` 已加防护，若出现此问题请确认最近是否覆盖了 `src/bridge/UnityView.tsx` 的降级逻辑。 |
| 构建结果与本地不一致 | 逐一比对 lockfile、Gradle 配置；必要时在 PR 中附上构建日志 (`*_Build Debug APK.txt`) 便于回溯。 |

## 7. Release 构建（预留）

> 当前流程仅生成 Debug APK。后续若需发布，请在此基础上扩展：

1. 新增 Release 工作流（或在现有工作流加入参数）。
2. 引入正式签名证书（通过 GitHub Secrets 或加密文件）。
3. 启用 `android.splits.abi { enable true }` 和 `shrinkResources true`，减小包体。
4. 根据需要生成 `.aab` 并上传测试渠道或商店。

## 8. 更新要求

- 修改 `.github/workflows/android.yml`、`apps/mobile/android/build.gradle` 或构建依赖时，请同步更新本文档；
- 对应的构建日志请保存在仓库根目录的 `*_Build Debug APK.txt`，便于后续排查历史问题。
