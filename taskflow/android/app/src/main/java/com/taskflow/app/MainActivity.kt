package com.taskflow.app

import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.webkit.WebView
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WebView.setWebContentsDebuggingEnabled(true)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        )

        // Calcular altura real de la status bar
        val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
        val statusBarPx = if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 72
        val statusBarDp = Math.round(statusBarPx / resources.displayMetrics.density)

        // Inyectar como variable CSS
        bridge.webView.post {
            bridge.webView.evaluateJavascript(
                "document.documentElement.style.setProperty('--sat', '${statusBarDp}px');",
                null
            )
        }
    }
}