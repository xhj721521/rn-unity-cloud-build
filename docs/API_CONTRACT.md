# 链上与后端接口约定

## 概述
React Native 通过 `services/web3` 访问链上与业务服务，并与 Unity 同步结果。目前阶段使用 Mock 数据，后续将逐步切换至真实 SDK 和服务端 API。

## 账户与认证
- **获取账户概要**
  - `GET /account/:address/summary`
  - 响应字段：
    - `address`: string
    - `displayName`: string
    - `level`: number
    - `powerScore`: number
    - `tokens`: Array<{ id, name, amount }>
    - `nfts`: Array<{ id, name, amount }>
- **钱包绑定**
  - 计划使用 WalletConnect v2 或 MetaMask SDK（React Native），返回签名后的授权凭证。
  - 后端保存 `sessionToken` 及签名时间，定期校验有效期。

## 资产数据
- **代币余额**
  - 使用链上 SDK（首选 ethers.js + `@ethersproject/providers` 的 React Native 适配方案，备选 viem + custom transport）。
  - 接口封装为 `getTokenBalances(address, chainId)`，对多链扩展。
- **NFT 列表**
  - 方案一：直接调用合约 `tokenOfOwner`，配合 Alchemy / Infura API 加速。
  - 方案二：使用后端索引（GraphQL/REST），返回标准化字段。
- **排行榜 / 事件日志**
  - 后端提供 GraphQL/REST 接口，例如：
    ```json
    {
      "season": "S1",
      "topPlayers": [
        { "address": "0xabc", "score": 2450 }
      ],
      "updatedAt": "2025-01-01T12:00:00Z"
    }
    ```

## Unity 数据交互
- **试炼初始化**
  - RN → Unity：`INIT_SCENE`，payload 包含 `sceneName`, `loadout`, `playerState`。
- **战斗结果上报**
  - Unity → RN：`RESULT_SUBMIT`
  - RN 收到后调用 `POST /combat/result`，请求体示例：
    ```json
    {
      "address": "0x123",
      "difficulty": "normal",
      "score": 1820,
      "rewards": [
        { "id": "tok-energy", "amount": 120 }
      ]
    }
    ```
- **链上数据请求**
  - Unity 发送 `REQUEST_CHAIN_DATA`，携带 `dataType`、`filters`。
  - RN 根据类型调用 web3 服务，并回传 `CHAIN_DATA_RESPONSE`。

## 错误处理
- 统一错误结构：
  ```json
  {
    "error": {
      "code": "CHAIN_TIMEOUT",
      "message": "链上查询超时",
      "retryable": true
    }
  }
  ```
- RN 根据 `retryable` 决定自动重试或提示用户；同时写入日志用于追踪。

## 安全与校验
- 对关键操作使用消息签名或 Session Token。
- Unity 只展示数据与执行本地逻辑，链上交易必须由 RN 进行签名与发送。
- 接入真实 API 前对 payload 进行 Schema 校验，防止异常数据导致崩溃。

## SDK 集成路线
1. **阶段 1（当前）**：Mock 数据 + 本地 JSON；确保 UI 与消息流稳定。
2. **阶段 2**：引入 ethers.js（或 viem）+ WalletConnect，实现读取余额、NFT、基础交易签名。  
   - 需要替换 `mockClient.ts` 并新增缓存策略（AsyncStorage）。
3. **阶段 3**：对接后端聚合接口（排行榜、事件日志），统一鉴权（Session Token / JWT）。
4. **阶段 4**：完善安全策略（风控、重放检测），上线监控告警，对异常调用进行降级处理。

