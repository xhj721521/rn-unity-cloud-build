package com.rngameshell.unity

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * UnityBridgeModule is a placeholder native module that wires React Native to the Unity
 * runtime. The current implementation only logs invocations and echoes requests back to JS.
 * TODO: Replace stub logic with real UnityPlayer integration once unityLibrary is exported.
 */
class UnityBridgeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = MODULE_NAME

  @ReactMethod
  fun initUnity(promise: Promise) {
    Log.i(TAG, "initUnity called (stub)")
    // TODO: Launch UnityPlayerActivity / attach Unity runtime and resolve when ready.
    promise.resolve(null)
  }

  @ReactMethod
  fun sendMessage(type: String, payload: String?) {
    Log.i(TAG, "sendMessage called (stub) type=$type payload=$payload")
    // TODO: Forward message into Unity via UnityPlayer.UnitySendMessage(...)
  }

  /**
   * Helper for native side to emit events back to JS bridge.
   */
  private fun emitEvent(type: String, payload: WritableMap?) {
    val params = Arguments.createMap().apply {
      putString("type", type)
      if (payload != null) {
        putMap("payload", payload)
      }
    }
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(EVENT_UNITY_MESSAGE, params)
  }

  companion object {
    private const val MODULE_NAME = "UnityBridge"
    private const val EVENT_UNITY_MESSAGE = "UnityMessage"
    private const val TAG = "UnityBridgeModule"

    /**
     * Convenience API for future Unity callbacks.
     */
    fun sendUnityEvent(
        reactContext: ReactApplicationContext,
        type: String,
        payload: WritableMap? = null
    ) {
      val module =
          reactContext
              .getNativeModule(UnityBridgeModule::class.java)
      module?.emitEvent(type, payload)
    }
  }
}
