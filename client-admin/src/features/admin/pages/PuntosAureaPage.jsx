import { useCallback, useMemo, useState } from "react";
import { canjearRecompensa, obtenerMisPuntos } from "../../../services/puntos.service";
import { UserShell } from "../../user/components/UserShell";
import {
  ErrorState,
  LoadingState,
  SectionHeader,
  UserProfileCard,
} from "../../user/components/UserUi";
import { useAuthStore } from "../../auth/store/authStore";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import "../styles/puntos.css";

const LEVEL_META = {
  BRONCE: { icon: "ri-medal-line", color: "#cd7f32" },
  PLATA: { icon: "ri-medal-2-line", color: "#c0c0c0" },
  ORO: { icon: "ri-vip-crown-line", color: "#d4af37" },
  DIAMANTE: { icon: "ri-vip-diamond-line", color: "#dce8ef" },
};

export const PuntosAureaPage = () => {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setSummary(await obtenerMisPuntos());
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(load, 30000);

  const progress = useMemo(() => {
    if (!summary?.puntosSiguienteNivel) return 100;
    const current = summary.niveles.find((item) => item.nombre === summary.nivel);
    const span = summary.puntosSiguienteNivel - current.minimo;
    return Math.min(100, Math.round(((summary.puntos - current.minimo) / span) * 100));
  }, [summary]);

  const redeem = async (reward) => {
    try {
      setRedeeming(reward.id);
      setError("");
      const result = await canjearRecompensa(reward.id);
      setMessage(`${reward.nombre} canjeada. Saldo: ${result.puntos} puntos.`);
      await load();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setRedeeming("");
    }
  };

  return (
    <UserShell contentClassName="puntos-user-page">
      <div className="puntos-topbar">
        <SectionHeader
          eyebrow="Fidelidad Aurea"
          title="Puntos Aurea"
          description="Cada quetzal de un pedido entregado se convierte en un punto."
        />
        <UserProfileCard user={user} compact level={summary?.nivel} />
      </div>

      {loading && !summary && <LoadingState title="Cargando tus puntos" />}
      {error && <ErrorState description={error} onRetry={load} />}
      {message && <div className="admin-feedback success">{message}</div>}

      {summary && (
        <div className="puntos-grid">
          <section className="puntos-hero-card card">
            <div className="puntos-hero-left">
              <p className="puntos-disponibles-label">Puntos disponibles</p>
              <div className="puntos-numero-row">
                <div className="puntos-star-icon"><i className="ri-star-fill" /></div>
                <span className="puntos-numero">{summary.puntos.toLocaleString("es-GT")}</span>
              </div>
              <p className="puntos-equivale">Saldo acreditado únicamente por pedidos entregados y bonos.</p>
            </div>
            <div className="puntos-hero-right">
              <p className="puntos-progreso-label">Nivel actual</p>
              <p className="puntos-nivel-nombre">{summary.nivel}</p>
              <div className="puntos-progress-bar">
                <div className="puntos-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="puntos-progress-copy">
                {summary.siguienteNivel
                  ? `Faltan ${summary.puntosFaltantes} puntos para ${summary.siguienteNivel}.`
                  : "Alcanzaste el nivel máximo Aurea."}
              </p>
            </div>
            <div className="puntos-corona-bg"><i className={LEVEL_META[summary.nivel].icon} /></div>
          </section>

          <section className="puntos-niveles-card card">
            <h3 className="puntos-card-title">Niveles Aurea</h3>
            <div className="puntos-niveles-list">
              {summary.niveles.map((level) => (
                <div className={`puntos-nivel-item${level.nombre === summary.nivel ? " activo" : ""}`} key={level.nombre}>
                  <div className="puntos-nivel-icon" style={{ color: LEVEL_META[level.nombre].color }}>
                    <i className={LEVEL_META[level.nombre].icon} />
                  </div>
                  <div className="puntos-nivel-info">
                    <p className="puntos-nivel-title">{level.nombre}</p>
                    <p className="puntos-nivel-rango">{level.minimo.toLocaleString()} {level.maximo ? `- ${level.maximo.toLocaleString()}` : "+"} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card puntos-actividad-card">
            <div className="puntos-section-header"><h3 className="puntos-card-title">Historial de puntos</h3></div>
            <div className="puntos-actividad-list">
              {summary.movimientos.map((movement) => (
                <div className="puntos-act-item" key={movement.id}>
                  <div className="puntos-act-icon"><i className={movement.puntos > 0 ? "ri-add-circle-line" : "ri-gift-line"} /></div>
                  <div className="puntos-act-info">
                    <p className="puntos-act-titulo">{movement.motivo}</p>
                    <p className="puntos-act-fecha">{new Date(movement.fecha).toLocaleString("es-GT")}</p>
                  </div>
                  <div className="puntos-act-right">
                    <p className="puntos-act-puntos">{movement.puntos > 0 ? "+" : ""}{movement.puntos} puntos</p>
                    <p className="puntos-act-detalle">Saldo {movement.saldoResultante}</p>
                  </div>
                </div>
              ))}
              {!summary.movimientos.length && <div className="empty-state">Aún no hay movimientos de puntos.</div>}
            </div>
          </section>

          <section className="card puntos-recompensas-card">
            <div className="puntos-section-header"><h3 className="puntos-card-title">Recompensas disponibles</h3></div>
            <div className="puntos-recomp-slider">
              {summary.recompensas.map((reward) => (
                <article className="puntos-recomp-item" key={reward.id}>
                  <div className="puntos-recomp-img-wrap">
                    <img src={reward.imagen || "/plato1.jpeg"} alt={reward.nombre} />
                  </div>
                  <p className="puntos-recomp-nombre">{reward.nombre}</p>
                  <p className="puntos-recomp-pts">{reward.puntosRequeridos} puntos</p>
                  <button
                    className="puntos-canjear-btn"
                    disabled={summary.puntos < reward.puntosRequeridos || redeeming === reward.id}
                    onClick={() => redeem(reward)}
                  >
                    {redeeming === reward.id ? "Canjeando..." : "Canjear"}
                  </button>
                </article>
              ))}
              {!summary.recompensas.length && <div className="empty-state">No hay recompensas activas.</div>}
            </div>
          </section>
        </div>
      )}
    </UserShell>
  );
};
