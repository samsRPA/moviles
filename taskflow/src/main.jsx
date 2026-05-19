import { StrictMode }    from "react";
import { createRoot }    from "react-dom/client";
import { Capacitor }     from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App as CapApp } from "@capacitor/app";
import App               from "./App.jsx";

if (Capacitor.isNativePlatform()) {
  document.documentElement.classList.add("capacitor");
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  StatusBar.setBackgroundColor({ color: "#00000000" }).catch(() => {});
}

CapApp.addListener("backButton", ({ canGoBack }) => {
  if (!canGoBack) CapApp.exitApp();
}).catch(() => {});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);