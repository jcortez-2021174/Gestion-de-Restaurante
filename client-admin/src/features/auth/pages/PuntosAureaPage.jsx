import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/dashboard.css";
import "../styles/puntos.css";

// ── datos mock ──────────────────────────────────────────────────────────────
const NIVELES = [
  { nombre: "Bronce",  rango: "0 – 999 pts",      desc: "5% de descuento",  icon: "ri-medal-line",       color: "#cd7f32", activo: false },
  { nombre: "Plata",   rango: "1,000 – 2,499 pts", desc: "10% de descuento", icon: "ri-medal-2-line",     color: "#c0c0c0", activo: false },
  { nombre: "Oro",     rango: "2,500 – 4,999 pts", desc: "15% de descuento", icon: "ri-vip-crown-line",   color: "#d4af37", activo: true  },
  { nombre: "Platino", rango: "5,000+ pts",         desc: "20% de descuento", icon: "ri-vip-diamond-line", color: "#e5e4e2", activo: false },
];

const ACTIVIDAD = [
  { tipo: "pedido",  icono: "ri-shopping-bag-line",  titulo: "Pedido #4587",         fecha: "15 de mayo, 2024",  puntos: 125, detalle: "Q1,250.00" },
  { tipo: "reserva", icono: "ri-calendar-check-line", titulo: "Reserva #1256",        fecha: "10 de mayo, 2024",  puntos: 50,  detalle: "Reserva completada" },
  { tipo: "visita",  icono: "ri-store-2-line",         titulo: "Visita al restaurante", fecha: "5 de mayo, 2024",   puntos: 25,  detalle: "Gracias por visitarnos" },
  { tipo: "pedido",  icono: "ri-shopping-bag-line",  titulo: "Pedido #4412",         fecha: "28 de abril, 2024", puntos: 110, detalle: "Q1,100.00" },
];

const RECOMPENSAS = [
  { nombre: "Postre de cortesía", puntos: 400, img: "/plato1.jpeg" },
  { nombre: "15% de descuento",   puntos: 600, img: "/plato2.jpeg" },
  { nombre: "Copa de vino",       puntos: 500, img: "/plato3.jpeg" },
  { nombre: "Entrada gratis",     puntos: 350, img: "/plato4.jpeg" },
];

const PUNTOS_USUARIO   = 1250;
const NIVEL_ACTUAL     = "Oro";
const PUNTOS_SIGUIENTE = 1750;

// ────────────────────────────────────────────────────────────────────────────
export const PuntosAureaPage = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [recompIdx, setRecompIdx] = useState(0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const progreso = Math.round((PUNTOS_USUARIO / PUNTOS_SIGUIENTE) * 100);

  return (
    <div className="container">
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>

        <ul className="menu">
          <Link to="/home" className="menu-link">
            <li><i className="ri-home-4-line"></i> Inicio</li>
          </Link>
          <Link to="/user/menu" className="menu-link">
            <li><i className="ri-restaurant-line"></i> Menú</li>
          </Link>
          <Link to="/user/reservations" className="menu-link">
            <li><i className="ri-calendar-line"></i> Reservas</li>
          </Link>
          <Link to="/user/orders" className="menu-link">
            <li><i className="ri-motorbike-line"></i> Pedidos</li>
          </Link>
          <Link to="/user/nosotros" className="menu-link">
            <li><i className="ri-group-line"></i> Sobre Nosotros</li>
          </Link>
          <Link to="/user/contacto" className="menu-link">
            <li><i className="ri-contacts-book-line"></i> Contacto</li>
          </Link>
        </ul>

        {/* NIVEL CARD EN SIDEBAR */}
        <div className="puntos-sidebar-card">
          <div className="psc-crown"><i className="ri-vip-crown-line"></i></div>
          <p className="psc-nivel-label">Nivel actual</p>
          <p className="psc-nivel-nombre">Oro</p>
          <p className="psc-pts">{PUNTOS_USUARIO.toLocaleString()} pts</p>
          <p className="psc-pts-label">puntos disponibles</p>
          <div className="psc-bar-wrap">
            <div className="psc-bar-fill" style={{ width: `${progreso}%` }}></div>
          </div>
          <p className="psc-faltan">Faltan {PUNTOS_SIGUIENTE - PUNTOS_USUARIO} pts para el siguiente nivel</p>
          <Link to="/user/puntos" className="psc-btn">Ver mis recompensas</Link>
        </div>

        <div className="sidebar-contact">
          <p className="sidebar-contact-title">CONTÁCTANOS</p>
          <div className="sidebar-contact-item"><i className="ri-phone-line"></i><span>+502 1234 5678</span></div>
          <div className="sidebar-contact-item"><i className="ri-mail-line"></i><span>hola@aurea.com</span></div>
          <div className="sidebar-contact-item"><i className="ri-map-pin-line"></i><span>5ta avenida 12-34, Zona 10</span></div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="main" style={{ padding: "28px" }}>

        {/* TOPBAR */}
        <div className="puntos-topbar">
          <div>
            <h1 className="menu-page-title">Puntos Aurea</h1>
            <p className="menu-page-sub">Disfruta de beneficios exclusivos por ser parte de nuestra comunidad.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className="puntos-location-pill">
              <i className="ri-map-pin-line"></i>
              <span>Zona 10, Ciudad de Guatemala</span>
              <i className="ri-arrow-down-s-line"></i>
            </div>
            <div className="notification" style={{ color: "var(--gold)", fontSize: "22px", position: "relative", cursor: "pointer" }}>
              <i className="ri-notification-3-line"></i>
              <span className="badge">2</span>
            </div>
            <div className="menu-user-pill">
              <i className="ri-user-line" style={{ color: "var(--gold)" }}></i>
              <div>
                <span className="menu-user-name">Hola, {user?.name || "Carlos"}</span>
                <small className="menu-user-role">Cliente</small>
              </div>
              <button onClick={handleLogout} className="btn-mini" style={{ padding: "6px 10px" }}>
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="puntos-grid">

          {/* TARJETA PUNTOS + PROGRESO */}
          <div className="puntos-hero-card card">
            <div className="puntos-hero-left">
              <p className="puntos-disponibles-label">Tus puntos disponibles</p>
              <div className="puntos-numero-row">
                <div className="puntos-star-icon"><i className="ri-star-fill"></i></div>
                <span className="puntos-numero">{PUNTOS_USUARIO.toLocaleString()}</span>
              </div>
              <p className="puntos-equivale">
                Equivalente a <strong>Q{(PUNTOS_USUARIO / 10).toFixed(2)}</strong>
                <span className="puntos-info-icon"><i className="ri-information-line"></i></span>
              </p>
              <button className="puntos-ver-btn">Ver mis recompensas</button>
            </div>
            <div className="puntos-hero-right">
              <p className="puntos-progreso-label">Tu progreso</p>
              <p className="puntos-nivel-nombre">{NIVEL_ACTUAL}</p>
              <div className="puntos-progress-bar">
                <div className="puntos-progress-fill" style={{ width: `${progreso}%` }}></div>
              </div>
              <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>
                Faltan <strong style={{ color: "#fff" }}>{PUNTOS_SIGUIENTE - PUNTOS_USUARIO} puntos</strong> para alcanzar Nivel Platino
              </p>
              <div className="puntos-rate-row">
                <i className="ri-star-fill" style={{ color: "var(--gold)" }}></i>
                <span>1 punto por cada <strong>Q10.00</strong> de consumo</span>
              </div>
            </div>
            <div className="puntos-corona-bg"><i className="ri-vip-crown-line"></i></div>
          </div>

          {/* NIVELES */}
          <div className="puntos-niveles-card card">
            <h3 className="puntos-card-title">Niveles Aurea</h3>
            <div className="puntos-niveles-list">
              {NIVELES.map((n) => (
                <div key={n.nombre} className={`puntos-nivel-item${n.activo ? " activo" : ""}`}>
                  <div className="puntos-nivel-icon" style={{ color: n.color }}>
                    <i className={n.icon}></i>
                  </div>
                  <div className="puntos-nivel-info">
                    <p className="puntos-nivel-title">{n.nombre}</p>
                    <p className="puntos-nivel-rango">{n.rango}</p>
                  </div>
                  <p className="puntos-nivel-desc" style={{ color: n.activo ? "var(--gold)" : "#888" }}>{n.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BENEFICIOS DEL NIVEL ACTUAL */}
          <div className="card puntos-beneficios-card">
            <h3 className="puntos-card-title" style={{ color: "var(--gold)" }}>Beneficios de tu nivel Oro</h3>
            <div className="puntos-beneficios-grid">
              <div className="puntos-ben-item">
                <i className="ri-percent-line"></i>
                <p>15% de descuento en tu cuenta</p>
              </div>
              <div className="puntos-ben-item">
                <i className="ri-cake-line"></i>
                <p>Postres de cortesía</p>
              </div>
              <div className="puntos-ben-item">
                <i className="ri-star-smile-line"></i>
                <p>Invitaciones a eventos exclusivos</p>
              </div>
              <div className="puntos-ben-item">
                <i className="ri-vip-crown-line"></i>
                <p>Prioridad en reservaciones</p>
              </div>
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="card puntos-actividad-card">
            <div className="puntos-section-header">
              <h3 className="puntos-card-title">Actividad reciente</h3>
              <button className="puntos-ver-todas">Ver todas</button>
            </div>
            <div className="puntos-actividad-list">
              {ACTIVIDAD.map((a, i) => (
                <div className="puntos-act-item" key={i}>
                  <div className="puntos-act-icon"><i className={a.icono}></i></div>
                  <div className="puntos-act-info">
                    <p className="puntos-act-titulo">{a.titulo}</p>
                    <p className="puntos-act-fecha">{a.fecha}</p>
                  </div>
                  <div className="puntos-act-right">
                    <p className="puntos-act-puntos">+{a.puntos} puntos</p>
                    <p className="puntos-act-detalle">{a.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CÓMO GANAR PUNTOS */}
          <div className="card puntos-ganar-card">
            <h3 className="puntos-card-title">¿Cómo ganar puntos?</h3>
            <div className="puntos-ganar-list">
              <div className="puntos-ganar-item">
                <i className="ri-shopping-bag-line"></i>
                <div>
                  <p className="puntos-ganar-titulo">Realiza pedidos</p>
                  <p className="puntos-ganar-desc">Gana 1 punto por cada Q10.00 de consumo</p>
                </div>
              </div>
              <div className="puntos-ganar-item">
                <i className="ri-calendar-check-line"></i>
                <div>
                  <p className="puntos-ganar-titulo">Haz reservaciones</p>
                  <p className="puntos-ganar-desc">Gana 50 puntos por cada reserva completada</p>
                </div>
              </div>
              <div className="puntos-ganar-item">
                <i className="ri-group-line"></i>
                <div>
                  <p className="puntos-ganar-titulo">Visítanos</p>
                  <p className="puntos-ganar-desc">Gana 25 puntos por cada visita al restaurante</p>
                </div>
              </div>
            </div>
          </div>

          {/* RECOMPENSAS DESTACADAS */}
          <div className="card puntos-recompensas-card">
            <div className="puntos-section-header">
              <h3 className="puntos-card-title">Recompensas destacadas</h3>
              <button className="puntos-ver-todas">Ver todas</button>
            </div>
            <div className="puntos-recomp-slider">
              {RECOMPENSAS.map((r, i) => (
                <div className="puntos-recomp-item" key={i}>
                  <div className="puntos-recomp-img-wrap">
                    <img src={r.img} alt={r.nombre} />
                  </div>
                  <p className="puntos-recomp-nombre">{r.nombre}</p>
                  <p className="puntos-recomp-pts">{r.puntos} puntos</p>
                  <button className="puntos-canjear-btn">Canjear</button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="puntos-footer">
          © 2024 Aurea - El Arte del Cordero. Todos los derechos reservados.
          <div className="puntos-footer-socials">
            <a href="#"><i className="ri-facebook-fill"></i></a>
            <a href="#"><i className="ri-instagram-line"></i></a>
            <a href="#"><i className="ri-whatsapp-line"></i></a>
          </div>
        </div>
      </main>
    </div>
  );
};