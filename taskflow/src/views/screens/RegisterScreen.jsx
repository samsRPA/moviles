import { useState } from "react";

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const PasswordInput = ({ placeholder, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ paddingRight: "44px" }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{
          position: "absolute", right: "13px", top: "50%",
          transform: "translateY(-50%)",
          background: show ? "#EEF2FF" : "transparent",
          border: "none", cursor: "pointer",
          color: show ? "#4F46E5" : "#A5B4FC",
          padding: "4px", borderRadius: "6px",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "color 0.2s, background 0.2s",
        }}
        tabIndex={-1}
      >
        <EyeIcon open={show} />
      </button>
    </div>
  );
};

export default function RegisterScreen({ onRegister, onGoLogin, busy, error }) {
  const [form, setForm] = useState({ name: "", email: "", pass: "", pass2: "" });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="aw sin">
      <div className="ahero">
        <div className="alogo">✅</div>
        <div className="ah1">Crear cuenta</div>
        <div className="asub">Empieza a organizar tu día</div>
      </div>

      <div className="abody">
        {error && <div className="err">{error}</div>}

        <div className="iw">
          <label className="lbl">Nombre completo</label>
          <input
            type="text"
            placeholder="Juan Carlos Pérez"
            value={form.name}
            onChange={set("name")}
          />
        </div>

        <div className="iw">
          <label className="lbl">Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={set("email")}
          />
        </div>

        <div className="iw">
          <label className="lbl">Contraseña</label>
          <PasswordInput
            placeholder="Mínimo 6 caracteres"
            value={form.pass}
            onChange={set("pass")}
          />
        </div>

        <div className="iw">
          <label className="lbl">Confirmar contraseña</label>
          <PasswordInput
            placeholder="Repite tu contraseña"
            value={form.pass2}
            onChange={set("pass2")}
          />
        </div>

        <button
          className="btnp"
          onClick={() => !busy && onRegister(form)}
          disabled={busy}
        >
          {busy ? "Creando cuenta…" : "Crear cuenta"}
        </button>

        <div className="afoot">
          ¿Ya tienes cuenta?{" "}
          <button className="lnk" onClick={onGoLogin}>Inicia sesión</button>
        </div>
      </div>
    </div>
  );
}
