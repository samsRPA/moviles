import { useState } from "react";
import TaskCard from "../components/TaskCard";
import { getDayProgress, filterByCategory, getCategoryCounts } from "../../controllers/TaskController";
import { CATEGORIES } from "../../constants/categories";

export default function HomeScreen({
  user, tasks, tasksLoading,
  onToggleTask, onDeleteTask, onEditTask,
  onOpenModal,
  tab, onTabChange,
  onShowCalendar, onShowProfile,
}) {
  const [catFilter, setCatFilter] = useState("Todas");
  const progress   = getDayProgress(tasks);
  const catCounts  = getCategoryCounts(tasks);
  const filtered   = filterByCategory(tasks, catFilter);
  const today      = new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Bogota" });
  const filterOpts = ["Todas", ...CATEGORIES.map(c => c.label)];

  return (
    <>
      {/* ── HOME TAB ── */}
      {tab === "home" && (
        <div className="home sin">
          {/* Header */}
          <div className="hhdr">
            <div className="hrow">
              <div className="hgsm">
                <div className="hnm">Hola, {user.name?.split(" ")[0]} 👋</div>
                <div className="dchip">📅 {today}</div>
              </div>
              <button className="hav" onClick={onShowProfile}>
                {user.avatar}
              </button>
            </div>
            {/* Progress */}
            <div className="plbl">Progreso general</div>
            <div className="ppct">{progress.pct}%</div>
            <div className="pbar">
              <div className="pfill" style={{ width: `${progress.pct}%` }} />
            </div>
            <div style={{ fontSize: 12, color: "#A5B4FC", marginTop: 6 }}>
              {progress.done} de {progress.total} tareas completadas
            </div>
          </div>

          {/* Body */}
          <div className="hbody">
            {/* Categories */}
            <div className="sttl">Categorías</div>
            <div className="cats">
              {catCounts.map(cat => (
                <div
                  key={cat.label}
                  className="cat"
                  style={{ background: cat.bg }}
                  onClick={() => { onTabChange("tasks"); setCatFilter(cat.label); }}
                >
                  <div className="cic" style={{ background: cat.color + "22" }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="cnm">{cat.label}</div>
                    <div className="cct">{cat.pend} pendiente{cat.pend !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's tasks */}
            <div className="sttl">Tareas de hoy</div>
            {tasksLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                <div className="spinner" />
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#6B7280", fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
                Sin tareas por ahora.<br />¡Crea una con el botón +!
              </div>
            ) : (
              tasks.slice(0, 5).map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))
            )}
            {tasks.length > 5 && (
              <button
                className="lnk"
                style={{ display: "block", textAlign: "center", margin: "10px auto 0", fontSize: 13 }}
                onClick={() => onTabChange("tasks")}
              >
                Ver todas ({tasks.length}) →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── TASKS TAB ── */}
      {tab === "tasks" && (
        <div className="taskscr sin">
          <div className="thdr">
            <div className="tttl">Mis Tareas</div>
            <div className="fchips">
              {filterOpts.map(f => (
                <button
                  key={f}
                  className={`fchip ${catFilter === f ? "on" : "off"}`}
                  onClick={() => setCatFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="tbody">
            {tasksLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <div className="spinner" />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280", fontSize: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                No hay tareas{catFilter !== "Todas" ? ` en "${catFilter}"` : ""}.
              </div>
            ) : (
              filtered.map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── FAB ── */}
      <button className="fab" onClick={onOpenModal} title="Nueva tarea">＋</button>

      {/* ── BOTTOM NAV ── */}
      <nav className="bnav">
        {[
          { id: "home",     icon: "🏠", label: "Inicio"    },
          { id: "tasks",    icon: "📋", label: "Tareas"    },
          { id: "calendar", icon: "📅", label: "Calendario"},
          { id: "profile",  icon: "👤", label: "Perfil"    },
        ].map(n => (
          <button
            key={n.id}
            className={`nv${tab === n.id ? " on" : ""}`}
            onClick={() => {
              if (n.id === "calendar") { onShowCalendar(); }
              else if (n.id === "profile") { onShowProfile(); }
              else { onTabChange(n.id); }
            }}
          >
            <div className="nvdot" />
            <span className="nvic">{n.icon}</span>
            <span className="nvlbl">{n.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
