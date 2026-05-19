import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../../constants/categories";

const today = () => new Date().toISOString().split("T")[0];

export default function CreateTaskModal({ onSave, onClose, busy }) {
  const [form, setForm] = useState({
    title:    "",
    date:     today(),
    time:     "",
    category: "Trabajo",
    priority: "Media",
    desc:     "",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const canSave = form.title.trim().length > 0;

  return (
    <div className="ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bs">
        <div style={{ padding: "10px 0 0" }}>
          <div className="bhd" />
        </div>
        <div className="bh">
          <div className="bttl">Nueva tarea</div>
          <button className="bcl" onClick={onClose}>✕</button>
        </div>

        <div className="bbody">
          {/* Title */}
          <label className="flbl">Título *</label>
          <input
            className="finp"
            type="text"
            placeholder="¿Qué necesitas hacer?"
            value={form.title}
            onChange={set("title")}
            autoFocus
          />

          {/* Date & Time */}
          <div className="crow">
            <div>
              <label className="flbl">Fecha</label>
              <input
                className="finp"
                type="date"
                value={form.date}
                onChange={set("date")}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div>
              <label className="flbl">Hora</label>
              <input
                className="finp"
                type="time"
                value={form.time}
                onChange={set("time")}
                style={{ marginBottom: 0 }}
              />
            </div>
          </div>

          {/* Category */}
          <label className="flbl" style={{ marginTop: 14 }}>Categoría</label>
          <div className="g2">
            {CATEGORIES.map(c => (
              <button
                key={c.label}
                className={`chip2${form.category === c.label ? " sel" : ""}`}
                onClick={() => setForm(f => ({ ...f, category: c.label }))}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Priority */}
          <label className="flbl">Prioridad</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {PRIORITIES.map(p => (
              <button
                key={p}
                className={`chip2${form.priority === p ? " sel" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setForm(f => ({ ...f, priority: p }))}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Description */}
          <label className="flbl">Descripción (opcional)</label>
          <textarea
            className="finp"
            placeholder="Notas adicionales..."
            value={form.desc}
            onChange={set("desc")}
            rows={2}
            style={{ resize: "none" }}
          />

          <button
            className="btnsv"
            onClick={() => canSave && !busy && onSave(form)}
            disabled={!canSave || busy}
          >
            {busy ? "Guardando…" : "Guardar tarea"}
          </button>
        </div>
      </div>
    </div>
  );
}
