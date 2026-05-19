import { useState } from "react";

export default function ProfileScreen({ user, onSave, onLogout }) {
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  };

  // Stats
  const total    = 0; // passed from parent if needed later
  const initials = user.avatar ?? user.name?.slice(0,2).toUpperCase() ?? "?";

  return (
    <div className="prof sin">
      {/* Header */}
      <div className="prof-hdr">
        <div className="prof-av-wrap">
          <div className="prof-av">{initials}</div>
        </div>
        <div className="prof-nm">{user.name}</div>
        <div className="prof-em">{user.email}</div>
      </div>

      {/* Body */}
      <div className="prof-body">
        {/* Account info card */}
        <div className="prof-card">
          <div className="prof-card-title">👤 Cuenta</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#6B7280" }}>Nombre</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{user.name}</span>
            </div>
            <div style={{ borderTop:"1px solid #F3F4F6" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#6B7280" }}>Correo</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#111827", maxWidth:180, textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</span>
            </div>
            <div style={{ borderTop:"1px solid #F3F4F6" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, color:"#6B7280" }}>Miembro desde</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>
                {user.createdAt?.toDate
                  ? user.createdAt.toDate().toLocaleDateString("es-CO", { month:"long", year:"numeric" })
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* App info */}
        <div className="prof-card">
          <div className="prof-card-title">ℹ️ Acerca de TaskFlow</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              ["Versión", "1.0.0"],
              ["Desarrollado por", "Obando · Ruíz · Monsalve"],
              ["Tecnología", "React + Firebase"],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:13, color:"#6B7280" }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:500, color:"#374151", textAlign:"right" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="prof-logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {toast && <div className="save-toast">✅ ¡Guardado!</div>}
    </div>
  );
}
