import { useState, useMemo } from "react";
import TaskCard from "../components/TaskCard";

/* ── Helpers ── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  // 0=Sun … 6=Sat → we want Mon-first so shift
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function parseDateStr(str) {
  // tasks store date as "15 de marzo" — parse via locale-aware approach
  // fallback: try to match against current locale string of a date
  if (!str || str === "Sin fecha") return null;
  // Try numeric ISO first (createdAt won't help here; task.date is already formatted)
  // We'll build a reverse lookup when rendering instead
  return str;
}

const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAYS_SHORT = ["L","M","X","J","V","S","D"];

// Convert a task's date string ("15 de marzo") to a Date object for the given year
function taskDateToObj(dateStr, year) {
  if (!dateStr || dateStr === "Sin fecha") return null;
  // dateStr format: "15 de marzo" or "1 de enero"
  const months = {
    enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
    julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11,
  };
  const match = dateStr.match(/(\d+)\s+de\s+(\w+)/i);
  if (!match) return null;
  const day   = parseInt(match[1], 10);
  const mon   = months[match[2].toLowerCase()];
  if (mon === undefined) return null;
  return new Date(year, mon, day);
}

export default function CalendarScreen({ tasks, onToggleTask, onDeleteTask }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState(
    `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  );

  /* Build a map: "year-month-day" → tasks[] */
  const taskMap = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const d = taskDateToObj(t.date, viewYear);
      if (!d) return;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks, viewYear]);

  // Also check adjacent years for tasks
  const taskMapFull = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      // Try current year, previous year, and next year
      [viewYear - 1, viewYear, viewYear + 1].forEach(yr => {
        const d = taskDateToObj(t.date, yr);
        if (!d) return;
        // Only include if month matches viewMonth (or adjacent months we'll scroll to)
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) map[key] = [];
        if (!map[key].find(x => x.id === t.id)) map[key].push(t);
      });
    });
    return map;
  }, [tasks, viewYear]);

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDow     = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectedTasks = taskMapFull[selected] ?? [];

  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  return (
    <div className="cal sin">
      {/* Header */}
      <div className="cal-hdr">
        <div className="cal-hdr-top">
          <div className="cal-ttl">Calendario</div>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month-lbl">
              {MONTHS_ES[viewMonth]} {viewYear}
            </span>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="cal-grid-wrap">
        {/* Day headers */}
        <div className="cal-dow-row">
          {DAYS_SHORT.map(d => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="cal-days">
          {/* Empty leading cells */}
          {Array.from({ length: firstDow }).map((_, i) => (
            <div key={`e-${i}`} className="cal-day empty" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day    = i + 1;
            const key    = `${viewYear}-${viewMonth}-${day}`;
            const isToday    = key === todayKey;
            const isSelected = key === selected;
            const dayTasks   = taskMapFull[key] ?? [];
            const hasTasks   = dayTasks.length > 0;
            const allDone    = hasTasks && dayTasks.every(t => t.done);

            return (
              <div
                key={key}
                className={[
                  "cal-day",
                  isToday    ? "today"    : "",
                  isSelected ? "selected" : "",
                  hasTasks   ? "has-tasks": "",
                ].join(" ").trim()}
                onClick={() => setSelected(key)}
              >
                <span className="cal-day-num">{day}</span>
                {hasTasks && (
                  <div className="cal-dots">
                    {dayTasks.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="cal-dot"
                        style={{
                          background: allDone ? "#10B981" : t.color,
                          opacity: t.done ? 0.4 : 1,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="cal-day-tasks">
        <div className="cal-day-tasks-hdr">
          <span className="cal-day-tasks-lbl">
            {(() => {
              const parts = selected.split("-");
              const d = parseInt(parts[2], 10);
              const m = parseInt(parts[1], 10);
              const y = parseInt(parts[0], 10);
              const isToday = selected === todayKey;
              return isToday
                ? `Hoy · ${d} de ${MONTHS_ES[m].toLowerCase()}`
                : `${d} de ${MONTHS_ES[m].toLowerCase()} ${y}`;
            })()}
          </span>
          <span className="cal-day-tasks-count">
            {selectedTasks.length} tarea{selectedTasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="cal-day-tasks-body">
          {selectedTasks.length === 0 ? (
            <div className="cal-empty">
              <div className="cal-empty-ic">📅</div>
              <div className="cal-empty-txt">Sin tareas este día</div>
            </div>
          ) : (
            selectedTasks.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
