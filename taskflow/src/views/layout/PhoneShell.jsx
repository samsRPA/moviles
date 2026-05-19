import { Capacitor } from "@capacitor/core";

const isNative = Capacitor.isNativePlatform();

export function StatusBar({ dark = false }) {
  if (isNative) return null;

  const time = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className={`sbar ${dark ? "dk" : "lt"}`}>
      <span style={{ marginLeft: 14 }}>{time}</span>
      <div className="sicons">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="4"  width="3" height="8"  rx="1" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.4"/>
          <rect x="4" y="3"  width="3" height="9"  rx="1" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.6"/>
          <rect x="8" y="1"  width="3" height="11" rx="1" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.8"/>
          <rect x="12" y="0" width="3" height="12" rx="1" fill={dark ? "#fff" : "#1E1B4B"}/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 24 16" fill="none">
          <path d="M12 4C9.33 4 6.93 5.07 5.17 6.83L3 4.67C5.33 2.33 8.5 1 12 1s6.67 1.33 9 3.67L18.83 6.83C17.07 5.07 14.67 4 12 4z" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.5"/>
          <path d="M12 8c-1.67 0-3.17.67-4.27 1.73L5.5 7.5C7.17 5.83 9.47 5 12 5s4.83.83 6.5 2.5l-2.23 2.23C15.17 8.67 13.67 8 12 8z" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.75"/>
          <circle cx="12" cy="14" r="2" fill={dark ? "#fff" : "#1E1B4B"}/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3.5" stroke={dark ? "#fff" : "#1E1B4B"} strokeOpacity="0.5"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.9"/>
          <path d="M22 4v4a2 2 0 0 0 0-4z" fill={dark ? "#fff" : "#1E1B4B"} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

export default function PhoneShell({ children, darkBar = false }) {
  if (isNative) {
    return <div className="shell"><div className="screen">{children}</div></div>;
  }

  return (
    <div className="shell">
      <div className="notch">
        <div className="nc" />
        <div className="np" />
      </div>
      <StatusBar dark={darkBar} />
      <div className="screen">
        {children}
      </div>
    </div>
  );
}