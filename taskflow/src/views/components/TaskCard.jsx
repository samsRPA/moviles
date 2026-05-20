import { PRIORITY_STYLES } from "../../constants/theme";

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const pri = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Media;

  return (
    <div className={`tc${task.done ? " done" : ""}`}>
      <div className="tcstrip" style={{ background: task.color }} />
      <div
        className={`tchk${task.done ? " on" : ""}`}
        onClick={() => onToggle(task.id, task.done)}
      />
      <div className="tinfo">
        <div className={`tnm${task.done ? " done" : ""}`}>{task.title}</div>
        <div className="tmeta">
          <span className="pri" style={{ background: pri.bg, color: pri.text }}>
            {task.priority}
          </span>
          {task.time && task.time !== "Sin hora" && (
            <span style={{ fontSize: 11, color: "#6B7280" }}>{task.time}</span>
          )}
          {task.category && (
            <span
              className="cat-badge"
              style={{ background: (task.color ?? "#4F46E5") + "22", color: task.color ?? "#4F46E5" }}
            >
              {task.category}
            </span>
          )}
        </div>
      </div>

      <div className="tc-actions">
        {onEdit && (
          <button className="tc-btn edit" onClick={() => onEdit(task)} title="Editar">
            ✏️
          </button>
        )}
        {onDelete && (
          <button className="tc-btn del" onClick={() => onDelete(task.id)} title="Eliminar">
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
