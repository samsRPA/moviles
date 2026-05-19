import { useState } from "react";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginScreen({ onLogin, onGoRegister, busy, error }) {
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);

  const submit = () => { if (!busy) onLogin(email, pass); };

  return (
    <div className="aw sin">
      <div className="ahero">
        <div className="alogo">
          <img src="./taskflow.jpeg" alt="Logo de TaskFlow" className="logo-img"
            style={{ width: "90px", height: "auto", borderRadius: "15px" }} />
        </div>
        <div className="ah1">Bienvenido a TaskFlow</div>
        <div className="asub">Inicia sesión para continuar</div>
      </div>

      <div className="abody">
        {error && <div className="err">{error}</div>}

        <div className="iw">
          <label className="lbl">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>

        <div className="iw">
          <label className="lbl">Contraseña</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPass(v => !v)}
              style={{
                position: "absolute",
                right: "13px",
                top: "50%",
                transform: "translateY(-50%)",
                background: showPass ? "#EEF2FF" : "transparent",
                border: "none",
                cursor: "pointer",
                color: showPass ? "#4F46E5" : "#A5B4FC",
                padding: "4px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s, background 0.2s",
              }}
            >
              {showPass ? <EyeOpen /> : <EyeClosed />}
            </button>
          </div>
        </div>

        <button className="btnp" onClick={submit} disabled={busy}>
          {busy ? "Ingresando…" : "Iniciar sesión"}
        </button>

        <div className="div"><span>o</span></div>

        <div className="afoot">
          ¿No tienes cuenta?{" "}
          <button className="lnk" onClick={onGoRegister}>Regístrate</button>
        </div>
      </div>
    </div>
  );
}
