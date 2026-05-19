import { PRIORITY_STYLES } from "../../constants/theme";

export default function TaskCard({ task, onToggle, onDelete }) {
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
          <span
            className="pri"
            style={{ background: pri.bg, color: pri.text }}
          >
            {task.priority}
          </span>
          <span style={{ fontSize: 11, color: "#6B7280" }}>
            {task.time !== "Sin hora" ? task.time : ""}
          </span>
          <span style={{ fontSize: 11, color: "#6B7280" }}>
            {task.category}
          </span>
        </div>
      </div>
      {onDelete && (
        <div className="tc-del" onClick={() => onDelete(task.id)}>
          🗑
        </div>
      )}
    </div>
  );
}
