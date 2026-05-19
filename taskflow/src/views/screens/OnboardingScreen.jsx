import { useState } from "react";
import { COLOMBIA_CITIES }           from "../../constants/cities";
import { INTERESTS, INTEREST_GROUPS } from "../../constants/interests";

export default function OnboardingScreen({ onComplete, onSkip }) {
  const [city,      setCity]      = useState("Bogota");
  const [selected,  setSelected]  = useState([]);

  const toggleInterest = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const canContinue = selected.length >= 3;

  return (
    <div className="ob sin">
      <div className="ob-hero">
        <div className="ob-step">Configuración inicial</div>
        <div className="ob-h1">Personaliza tu experiencia</div>
        <div className="ob-sub">
          Cuéntanos dónde estás y qué te interesa para recomendarte eventos relevantes.
        </div>
      </div>

      <div className="ob-body">
        {/* Ciudad */}
        <div className="ob-section-title">📍 Tu ciudad</div>
        <select
          className="ob-city-sel"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          {COLOMBIA_CITIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Intereses */}
        <div className="ob-section-title" style={{ marginTop: 20 }}>
          🎯 Tus intereses
        </div>

        {INTEREST_GROUPS.map(group => {
          const items = INTERESTS.filter(i => i.group === group);
          return (
            <div key={group} className="ob-group">
              <div className="ob-group-label">{group}</div>
              <div className="ob-chips">
                {items.map(item => (
                  <button
                    key={item.id}
                    className={`ob-chip${selected.includes(item.id) ? " sel" : ""}`}
                    onClick={() => toggleInterest(item.id)}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="ob-count">
          {selected.length === 0 ? (
            "Selecciona al menos 3 intereses"
          ) : (
            <>
              <span>{selected.length}</span> interés{selected.length !== 1 ? "es" : ""} seleccionado{selected.length !== 1 ? "s" : ""}
              {selected.length < 3 && ` — faltan ${3 - selected.length}`}
            </>
          )}
        </div>

        <button
          className="ob-btn"
          onClick={() => onComplete(city, selected)}
          disabled={!canContinue}
        >
          Continuar →
        </button>

        <button className="ob-skip" onClick={onSkip}>
          Saltar por ahora
        </button>
      </div>
    </div>
  );
}
