export default function SuccessScreen({ task, onGoHome, onCreateAnother }) {
  return (
    <div className="suc sin">
      <div className="suic">✅</div>
      <div className="suh">¡Tarea creada!</div>
      <div className="susub">Tu tarea se guardó correctamente.</div>

      {task && (
        <div className="sucard">
          <div className="surow">
            <span className="sulbl">Tarea</span>
            <span className="suval">{task.title}</span>
          </div>
          <div className="surow">
            <span className="sulbl">Categoría</span>
            <span className="suval">{task.category}</span>
          </div>
          <div className="surow">
            <span className="sulbl">Prioridad</span>
            <span className="suval">{task.priority}</span>
          </div>
          {task.time && task.time !== "Sin hora" && (
            <div className="surow">
              <span className="sulbl">Hora</span>
              <span className="suval">{task.time}</span>
            </div>
          )}
          {task.date && (
            <div className="surow">
              <span className="sulbl">Fecha</span>
              <span className="suval">{task.date}</span>
            </div>
          )}
        </div>
      )}

      <button className="btnp" style={{ width: "100%", maxWidth: 280 }} onClick={onGoHome}>
        Ir al inicio
      </button>
      <button className="lnksm" onClick={onCreateAnother}>
        + Crear otra tarea
      </button>
    </div>
  );
}
