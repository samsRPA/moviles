import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CATEGORIES, PRIORITIES } from "../../constants/categories";

/* ── Date helpers ── */
const toISO = (d) => {
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fromISO = (s) => s ? new Date(s + "T12:00:00") : new Date();
const todayBogota = () => {
  const parts = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" }).split("-");
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
};

// "19 de mayo" → "2026-05-19"
function taskDateToISO(dateStr) {
  if (!dateStr || dateStr === "Sin fecha") return toISO(new Date());
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const months = {
    enero:"01", febrero:"02", marzo:"03", abril:"04", mayo:"05", junio:"06",
    julio:"07", agosto:"08", septiembre:"09", octubre:"10", noviembre:"11", diciembre:"12",
  };
  const m = dateStr.match(/(\d+)\s+de\s+(\w+)(?:\s+(\d{4}))?/i);
  if (!m) return toISO(new Date());
  const day = String(parseInt(m[1])).padStart(2, "0");
  const mon = months[m[2].toLowerCase()] ?? "01";
  const yr  = m[3] ?? new Date().getFullYear();
  return `${yr}-${mon}-${day}`;
}

// "8:00 p.m." / "20:00" → "20:00"
function taskTimeToHHMM(timeStr) {
  if (!timeStr || timeStr === "Sin hora") return "09:00";
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  const m = timeStr.match(/(\d+):(\d+)\s*(a\.?\s*m\.?|p\.?\s*m\.?)/i);
  if (!m) return "09:00";
  let h = parseInt(m[1]);
  const mins = m[2];
  const period = m[3].replace(/[\s.]/g, "").toLowerCase();
  if (period === "pm" && h !== 12) h += 12;
  if (period === "am" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mins}`;
}

/* ── Time picker helpers ── */
function parseTime24(v) {
  if (!v) return { h: 9, m: 0, period: "AM" };
  const [hStr, mStr] = v.split(":");
  const h24 = parseInt(hStr, 10);
  const m   = parseInt(mStr, 10);
  return { h: h24 % 12 || 12, m, period: h24 >= 12 ? "PM" : "AM" };
}
function toTime24(h12, m, period) {
  let h24 = h12 % 12;
  if (period === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
const pad2 = (n) => String(n).padStart(2, "0");

/* ── TimePicker component ── */
function TimePicker({ value, onChange }) {
  const init = parseTime24(value);
  const [state, setState] = useState(init);
  const [hRaw,  setHRaw]  = useState(pad2(init.h));
  const [mRaw,  setMRaw]  = useState(pad2(init.m));

  const commit = (next) => { setState(next); onChange(toTime24(next.h, next.m, next.period)); };

  const incH = () => { const n = { ...state, h: state.h === 12 ? 1  : state.h + 1 }; setHRaw(pad2(n.h)); commit(n); };
  const decH = () => { const n = { ...state, h: state.h === 1  ? 12 : state.h - 1 }; setHRaw(pad2(n.h)); commit(n); };
  const incM = () => { const n = { ...state, m: (state.m + 5) % 60 };                 setMRaw(pad2(n.m)); commit(n); };
  const decM = () => { const n = { ...state, m: (state.m - 5 + 60) % 60 };            setMRaw(pad2(n.m)); commit(n); };

  const onHInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setHRaw(raw);
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 1 && v <= 12) commit({ ...state, h: v });
  };
  const onMInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setMRaw(raw);
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 0 && v <= 59) commit({ ...state, m: v });
  };
  const onHBlur = () => setHRaw(pad2(state.h));
  const onMBlur = () => setMRaw(pad2(state.m));

  return (
    <div className="tp-wrap">
      <div className="tp-col">
        <button className="tp-arr" onClick={incH} type="button">▲</button>
        <input className="tp-num-input" type="text" inputMode="numeric"
          value={hRaw} onChange={onHInput} onBlur={onHBlur} maxLength={2} />
        <button className="tp-arr" onClick={decH} type="button">▼</button>
      </div>
      <span className="tp-sep">:</span>
      <div className="tp-col">
        <button className="tp-arr" onClick={incM} type="button">▲</button>
        <input className="tp-num-input" type="text" inputMode="numeric"
          value={mRaw} onChange={onMInput} onBlur={onMBlur} maxLength={2} />
        <button className="tp-arr" onClick={decM} type="button">▼</button>
      </div>
      <div className="tp-period-pill">
        <button className={`tp-per${state.period === "AM" ? " on" : ""}`}
          onClick={() => commit({ ...state, period: "AM" })} type="button">AM</button>
        <button className={`tp-per${state.period === "PM" ? " on" : ""}`}
          onClick={() => commit({ ...state, period: "PM" })} type="button">PM</button>
      </div>
    </div>
  );
}

/* ── Main modal ── */
export default function CreateTaskModal({ onSave, onClose, busy, initialTask, error }) {
  const isEditing = !!initialTask;

  const [form, setForm] = useState(() => {
    if (!initialTask) return {
      title: "", date: todayBogota(), time: "09:00",
      category: "Trabajo", priority: "Media", desc: "",
    };
    return {
      title:    initialTask.title    || "",
      date:     taskDateToISO(initialTask.date),
      time:     taskTimeToHHMM(initialTask.time),
      category: initialTask.category || "Trabajo",
      priority: initialTask.priority || "Media",
      desc:     initialTask.desc     || "",
    };
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
          <div className="bttl">{isEditing ? "Editar tarea" : "Nueva tarea"}</div>
          <button className="bcl" onClick={onClose}>✕</button>
        </div>

        <div className="bbody">

          {/* Título */}
          <label className="flbl">Título *</label>
          <input
            className="finp"
            type="text"
            placeholder="¿Qué necesitas hacer?"
            value={form.title}
            onChange={set("title")}
            autoFocus
          />

          {/* Fecha y Hora */}
          <div className="crow">
            <div>
              <label className="flbl">📅 Fecha</label>
              <DatePicker
                selected={fromISO(form.date)}
                onChange={(d) => setForm(f => ({ ...f, date: toISO(d) }))}
                dateFormat="dd/MM/yyyy"
                withPortal
                className="finp"
                wrapperClassName="dp-wrap"
              />
            </div>
            <div>
              <label className="flbl">🕐 Hora</label>
              <TimePicker
                value={form.time}
                onChange={(v) => setForm(f => ({ ...f, time: v }))}
              />
            </div>
          </div>

          {/* Categoría */}
          <label className="flbl" style={{ marginTop: 4 }}>Categoría</label>
          <div className="g2" style={{ marginBottom: 14 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.label}
                type="button"
                className={`chip2${form.category === c.label ? " sel" : ""}`}
                onClick={() => setForm(f => ({ ...f, category: c.label }))}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Prioridad */}
          <label className="flbl">Prioridad</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`chip2${form.priority === p ? " sel" : ""}`}
                onClick={() => setForm(f => ({ ...f, priority: p }))}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Descripción */}
          <label className="flbl">Descripción (opcional)</label>
          <textarea
            className="finp"
            placeholder="Notas adicionales..."
            value={form.desc}
            onChange={set("desc")}
            rows={2}
            style={{ resize: "none" }}
          />

          {error && (
            <div style={{
              background: "#FEE2E2", color: "#991B1B", borderRadius: 10,
              padding: "10px 14px", fontSize: 13, marginBottom: 12,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btnsv"
            onClick={() => canSave && !busy && onSave(form)}
            disabled={!canSave || busy}
          >
            {busy ? "Guardando…" : isEditing ? "Guardar cambios" : "Guardar tarea"}
          </button>

        </div>
      </div>
    </div>
  );
}
