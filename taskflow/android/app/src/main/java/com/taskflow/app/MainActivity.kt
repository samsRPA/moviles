package com.taskflow.app

import android.os.Bundle
import android.view.Window
import android.view.WindowManager
import android.webkit.WebSettings
import android.webkit.WebView
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WebView.setWebContentsDebuggingEnabled(true)

        // Permitir HTTP desde HTTPS en WebView
        bridge.webView.settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        window.setFlags(
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        )

        // Calcular altura real de la status bar
        val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
        val statusBarPx = if (resourceId > 0) resources.getDimensionPixelSize(resourceId) else 72
        val statusBarDp = Math.round(statusBarPx / resources.displayMetrics.density)

        // Inyectar --sat antes y después del primer render para cubrire ambos casos
        val satScript = "document.documentElement.style.setProperty('--sat', '${statusBarDp}px');"
        bridge.webView.post { bridge.webView.evaluateJavascript(satScript, null) }
        bridge.webView.postDelayed({ bridge.webView.evaluateJavascript(satScript, null) }, 300)
    }
}