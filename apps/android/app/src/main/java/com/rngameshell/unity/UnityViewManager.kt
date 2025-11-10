package com.rngameshell.unity

import android.view.View
import android.widget.FrameLayout
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

/**
 * UnityViewManager exposes a React Native view named "UnityView".
 * Currently it renders an empty FrameLayout as a placeholder.
 * TODO: Attach UnityPlayer view to this container once Unity integration is ready.
 */
class UnityViewManager : SimpleViewManager<FrameLayout>() {

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
    return FrameLayout(reactContext).apply {
      // Placeholder styling for dev visibility; remove once Unity surface is attached.
      setBackgroundColor(0xFF14142E.toInt())
    }
  }

  override fun onDropViewInstance(view: FrameLayout) {
    super.onDropViewInstance(view)
    // TODO: Detach UnityPlayer view if attached.
  }

  companion object {
    private const val REACT_CLASS = "UnityView"
  }
}
