using System;
using UnityEngine;

namespace ChainGame
{
    /// <summary>
    /// Unity 与 React Native 的通信占位实现，负责接收原生注入的消息并回传事件。
    /// </summary>
    public class ReactBridge : MonoBehaviour
    {
        private static ReactBridge _instance;

        [Serializable]
        private class IncomingMessage
        {
            public string type;
            public string requestId;
            public string payload; // JSON string
        }

        [Serializable]
        private class SceneInitPayload
        {
            public string sceneName;
        }

        [Serializable]
        private class OutgoingMessage
        {
            public string type;
            public string payload;
        }

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        /// <summary>
        /// React Native 侧通过原生插件调用该方法，传入 JSON 字符串。
        /// </summary>
        /// <param name="messageJson">消息 JSON</param>
        public void OnReactMessage(string messageJson)
        {
            if (string.IsNullOrEmpty(messageJson))
            {
                Debug.LogWarning("[ReactBridge] Received empty message");
                return;
            }

            var message = JsonUtility.FromJson<IncomingMessage>(messageJson);
            Debug.Log($"[ReactBridge] Received {message.type}");

            switch (message.type)
            {
                case "INIT_SCENE":
                    HandleInitScene(message.payload);
                    break;
                case "START_COMBAT":
                    HandleStartCombat(message.payload);
                    break;
                case "PAUSE":
                    HandlePause();
                    break;
                case "LOAD_MAP":
                    HandleLoadMap(message.payload);
                    break;
                case "SCAN_RESOURCES":
                    HandleScanResources(message.payload);
                    break;
                case "WARP_TO_EVENT":
                    HandleWarpToEvent(message.payload);
                    break;
                case "SHOW_BLINDBOX":
                    HandleShowBlindBox(message.payload);
                    break;
                default:
                    Debug.LogWarning($"[ReactBridge] Unhandled message: {message.type}");
                    break;
            }
        }

        private void HandleInitScene(string payloadJson)
        {
            var payload = JsonUtility.FromJson<SceneInitPayload>(string.IsNullOrEmpty(payloadJson) ? "{\"sceneName\":\"PlaceholderScene\"}" : payloadJson);
            var sceneName = string.IsNullOrEmpty(payload.sceneName) ? "PlaceholderScene" : payload.sceneName;
            Debug.Log($"[ReactBridge] Initialising scene {sceneName}");

            SendToReact("SCENE_READY", $"{{\"sceneName\":\"{sceneName}\"}}");
        }

        private void HandleStartCombat(string payloadJson)
        {
            Debug.Log($"[ReactBridge] START_COMBAT payload: {payloadJson}");
            SendToReact("COMBAT_STARTED", payloadJson);
        }

        private void HandleLoadMap(string payloadJson)
        {
            Debug.Log($"[ReactBridge] LOAD_MAP payload: {payloadJson}");
            SendToReact("MAP_LOADED", payloadJson);
        }

        private void HandleScanResources(string payloadJson)
        {
            Debug.Log($"[ReactBridge] SCAN_RESOURCES payload: {payloadJson}");
            SendToReact("RESOURCES_SCANNED", payloadJson);
        }

        private void HandleWarpToEvent(string payloadJson)
        {
            Debug.Log($"[ReactBridge] WARP_TO_EVENT payload: {payloadJson}");
            SendToReact("EVENT_WARPED", payloadJson);
        }

        private void HandleShowBlindBox(string payloadJson)
        {
            Debug.Log($"[ReactBridge] SHOW_BLINDBOX payload: {payloadJson}");
            SendToReact("BLINDBOX_PRESENTED", payloadJson);
        }

        private void HandlePause()
        {
            Debug.Log("[ReactBridge] PAUSE");
            SendToReact("COMBAT_PAUSED", "{}");
        }

        /// <summary>
        /// 将消息回传给 React Native。实际发送需原生插件实现。
        /// </summary>
        /// <param name="type">事件类型</param>
        /// <param name="payloadJson">payload JSON 字符串</param>
        public static void SendToReact(string type, string payloadJson)
        {
            if (_instance == null)
            {
                Debug.LogWarning("[ReactBridge] No instance to send message");
                return;
            }

            var outgoing = new OutgoingMessage
            {
                type = type,
                payload = payloadJson
            };

            var json = JsonUtility.ToJson(outgoing);
            Debug.Log($"[ReactBridge] Dispatch {json}");

#if UNITY_ANDROID || UNITY_IOS
            // TODO: 调用原生插件，透传 json 给 React Native。
#endif
        }
    }
}
