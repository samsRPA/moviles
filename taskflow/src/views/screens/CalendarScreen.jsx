import { useState, useMemo } from "react";
import TaskCard from "../components/TaskCard";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAYS_SHORT = ["L","M","X","J","V","S","D"];

function taskDateToObj(dateStr, year) {
  if (!dateStr || dateStr === "Sin fecha") return null;
  const months = {
    enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5,
    julio:6, agosto:7, septiembre:8, octubre:9, noviembre:10, diciembre:11,
  };
  const match = dateStr.match(/(\d+)\s+de\s+(\w+)/i);
  if (!match) return null;
  const day = parseInt(match[1], 10);
  const mon = months[match[2].toLowerCase()];
  if (mon === undefined) return null;
  return new Date(year, mon, day);
}

function getTodayBogota() {
  const iso = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

export default function CalendarScreen({ tasks, onToggleTask, onDeleteTask, onEditTask }) {
  const todayB = getTodayBogota();
  const [viewYear,  setViewYear]  = useState(todayB.year);
  const [viewMonth, setViewMonth] = useState(todayB.month);
  const [selected,  setSelected]  = useState(
    `${todayB.year}-${todayB.month}-${todayB.day}`
  );

  const taskMapFull = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      [viewYear - 1, viewYear, viewYear + 1].forEach(yr => {
        const d = taskDateToObj(t.date, yr);
        if (!d) return;
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!map[key]) map[key] = [];
        if (!map[key].find(x => x.id === t.id)) map[key].push(t);
      });
    });
    return map;
  }, [tasks, viewYear]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow    = getFirstDayOfWeek(viewYear, viewMonth);

  const monthTaskCount = useMemo(() => {
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      count += (taskMapFull[`${viewYear}-${viewMonth}-${day}`] ?? []).length;
    }
    return count;
  }, [taskMapFull, viewYear, viewMonth, daysInMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectedTasks = taskMapFull[selected] ?? [];
  const todayKey = `${todayB.year}-${todayB.month}-${todayB.day}`;

  return (
    <div className="cal sin">
      {/* Header */}
      <div className="cal-hdr">
        <div className="cal-hdr-top">
          <div className="cal-ttl">Calendario</div>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
            <span className="cal-month-lbl">{MONTHS_ES[viewMonth]} {viewYear}</span>
            <button className="cal-nav-btn" onClick={nextMonth}>›</button>
          </div>
        </div>
        <div className="cal-hdr-sub">
          {monthTaskCount > 0
            ? `${monthTaskCount} tarea${monthTaskCount !== 1 ? "s" : ""} este mes`
            : "Sin tareas programadas este mes"}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="cal-grid-wrap">
        <div className="cal-dow-row">
          {DAYS_SHORT.map(d => (
            <div key={d} className="cal-dow">{d}</div>
          ))}
        </div>

        <div className="cal-days">
          {Array.from({ length: firstDow }).map((_, i) => (
            <div key={`e-${i}`} className="cal-day empty">
              <div className="cal-day-inner">
                <span className="cal-day-num"> </span>
              </div>
            </div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day      = i + 1;
            const key      = `${viewYear}-${viewMonth}-${day}`;
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
                ].filter(Boolean).join(" ")}
                onClick={() => setSelected(key)}
              >
                <div className="cal-day-inner">
                  <span className="cal-day-num">{day}</span>
                </div>
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
      <div className="cal-day-panel">
        <div className="cal-day-tasks-hdr">
          <span className="cal-day-tasks-lbl">
            {(() => {
              const parts = selected.split("-");
              const d = parseInt(parts[2], 10);
              const m = parseInt(parts[1], 10);
              const y = parseInt(parts[0], 10);
              return selected === todayKey
                ? `Hoy · ${d} de ${MONTHS_ES[m].toLowerCase()}`
                : `${d} de ${MONTHS_ES[m].toLowerCase()} ${y}`;
            })()}
          </span>
          <span className={`cal-day-tasks-count${selectedTasks.length === 0 ? " zero" : ""}`}>
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
                onEdit={onEditTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
