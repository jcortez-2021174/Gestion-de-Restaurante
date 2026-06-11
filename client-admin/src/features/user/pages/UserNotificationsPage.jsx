import { useCallback, useMemo, useState } from "react";
import { UserShell } from "../components/UserShell";
import { EmptyState, ErrorState, LoadingState, SectionHeader } from "../components/UserUi";
import { obtenerMisNotificaciones } from "../../../services/notificaciones.service";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import "../styles/user-notifications.css";

const categoryMeta = {
  PEDIDO: { label: "Pedidos", icon: "ri-shopping-bag-3-line" },
  RESERVACION: { label: "Reservaciones", icon: "ri-calendar-check-line" },
  PUNTOS: { label: "Puntos", icon: "ri-vip-crown-line" },
  RECOMPENSA: { label: "Recompensas", icon: "ri-gift-line" },
  CUENTA: { label: "Cuenta", icon: "ri-shield-user-line" },
};

const formatDate = (value) => {
  if (!value) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const data = await obtenerMisNotificaciones();
      setNotifications(data);
      setError("");
    } catch (requestError) {
      setError(requestError.userMessage || "No pudimos cargar tus notificaciones.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useSmartPolling(() => load({ silent: notifications.length > 0 }), 30000);

  const grouped = useMemo(() => notifications.reduce((acc, item) => {
    const key = item.categoria || "CUENTA";
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {}), [notifications]);

  return (
    <UserShell contentClassName="user-notifications-page">
      <SectionHeader
        eyebrow="Centro de notificaciones"
        title="Tu historial Aurea"
        description="Consulta confirmaciones de pedidos, reservaciones, puntos y cambios importantes de tu cuenta."
      />

      {loading && <LoadingState title="Cargando notificaciones" description="Estamos sincronizando tu historial reciente." />}
      {!loading && error && <ErrorState description={error} onRetry={() => load()} />}
      {!loading && !error && notifications.length === 0 && (
        <EmptyState
          icon="ri-notification-3-line"
          title="Aun no tienes notificaciones"
          description="Cuando realices pedidos, reservas o canjes, apareceran aqui."
        />
      )}

      {!loading && !error && notifications.length > 0 && (
        <div className="user-notification-groups">
          {Object.entries(grouped).map(([category, items]) => {
            const meta = categoryMeta[category] || categoryMeta.CUENTA;
            return (
              <section className="user-notification-group" key={category}>
                <header>
                  <span><i className={meta.icon} /></span>
                  <div>
                    <h3>{meta.label}</h3>
                    <p>{items.length} movimientos recientes</p>
                  </div>
                </header>
                <div className="user-notification-list">
                  {items.map((item) => (
                    <article className="user-notification-card" key={item.id}>
                      <span className="user-notification-dot" />
                      <div>
                        <strong>{item.asunto}</strong>
                        <p>{item.resumen || item.evento}</p>
                        <small>{formatDate(item.fecha)}</small>
                      </div>
                      <em>{item.estado}</em>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </UserShell>
  );
};
