import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import logo from "../../../assets/img/Logo.png";
import fondo from "../../../assets/img/Fondo.jpg";

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="auth-page">

      {/* FONDO */}
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${fondo})` }}
      />

      {/* Efectos */}
      <div className="auth-light auth-light-1" />
      <div className="auth-light auth-light-2" />
      <div className="auth-grid" />

      {/* CARD */}
      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo-wrap">
          <img src={logo} alt="logo" className="auth-logo-img" />
        </div>

        {/* Ornamento */}
        <div className="auth-ornament">
          <div className="auth-orn-line" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-diamond" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-line" />
        </div>

        {/* LOGIN */}
        {!isForgot && (
          <>
            <h1 className="auth-title">Bienvenido de Nuevo</h1>
            <p className="auth-subtitle">
              Ingresa a tu cuenta de administrador
            </p>
            <LoginForm onForgot={() => setIsForgot(true)} />
          </>
        )}

        {/* RECUPERAR */}
        {isForgot && (
        <>
            <h1 className="auth-title">Recuperar Contraseña</h1>
            <p className="auth-subtitle">
            Ingresa tu email para recibir instrucciones
            </p>

            <form className="auth-form">
            <input
                type="email"
                placeholder="correo@example.com"
            />

            <button className="btn-login">
                Mandar Token
            </button>
            </form>

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
            ¿Recordaste tu contraseña?{" "}
            <span
                style={{ color: "#d4af37", cursor: "pointer" }}
                onClick={() => setIsForgot(false)}
            >
                Iniciar Sesión
            </span>
            </p>
        </>
)}

      </div>
    </div>
  );
};