import { useState, useEffect } from "react";
import { getRecommendedEvents, formatEventDate, formatEventPrice } from "../../controllers/DiscoverController";
import { COLOMBIA_CITIES } from "../../constants/cities";

export default function DiscoverScreen({ user, onEditProfile }) {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const cityLabel = COLOMBIA_CITIES.find(c => c.value === user.city)?.label ?? user.city ?? "Colombia";

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendedEvents(user.city, user.interests ?? []);
      setEvents(data);
    } catch (e) {
      setError(e.message ?? "Error al cargar eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user.city, user.interests?.join(",")]);

  return (
    <div className="disc sin">
      {/* Header */}
      <div className="disc-hdr">
        <div className="disc-top">
          <div className="disc-ttl">Descubrir</div>
          <button className="disc-city" onClick={onEditProfile}>
            📍 {cityLabel}
          </button>
        </div>
        <div className="disc-sub">
          Eventos recomendados para ti
        </div>
      </div>

      {/* Body */}
      <div className="disc-body">
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0", gap: 14 }}>
            <div className="spinner" />
            <span style={{ fontSize: 13, color: "#6B7280" }}>Buscando eventos…</span>
          </div>
        )}

        {!loading && error && (
          <div className="disc-empty">
            <div className="disc-empty-ic">😕</div>
            <div className="disc-empty-ttl">No se pudo cargar</div>
            <div className="disc-empty-sub">{error}</div>
            <button className="disc-empty-btn" onClick={load}>Reintentar</button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="disc-empty">
            <div className="disc-empty-ic">🔍</div>
            <div className="disc-empty-ttl">Sin eventos cercanos</div>
            <div className="disc-empty-sub">
              No encontramos eventos en {cityLabel} con tus intereses actuales.
            </div>
            <button className="disc-empty-btn" onClick={onEditProfile}>
              Actualizar intereses
            </button>
          </div>
        )}

        {!loading && !error && events.map((ev, i) => (
          <div
            key={ev.id}
            className="ev-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {ev.image
              ? <img src={ev.image} alt={ev.name} className="ev-img" />
              : (
                <div className="ev-img-ph">
                  {ev.segment === "Sports" ? "🏆" : ev.segment === "Music" ? "🎵" : "🎭"}
                </div>
              )
            }
            <div className="ev-body">
              {(ev.genre || ev.segment) && (
                <div className="ev-tag">{ev.genre ?? ev.segment}</div>
              )}
              <div className="ev-name">{ev.name}</div>
              <div className="ev-meta">
                <div className="ev-row">
                  📅 {formatEventDate(ev.date, ev.time)}
                </div>
                <div className="ev-row">
                  📍 {ev.venue} · {ev.city}
                </div>
              </div>
            </div>
            <div className="ev-footer">
              <div className="ev-price">
                {formatEventPrice(ev.priceMin, ev.priceMax, ev.currency)}
              </div>
              <button className="ev-btn" onClick={() => ev.url && window.open(ev.url, "_blank")}>
                Ver más →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
