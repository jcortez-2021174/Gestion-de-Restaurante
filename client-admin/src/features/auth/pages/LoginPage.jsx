import { useState } from "react";
import "../styles/auth.css";
import { Login } from "../components/Login";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const LoginPage = () => {

  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className="auth-page">

      {/* Fondo */}
      <div
        className="auth-bg"
        style={{
          backgroundImage: "url('/Fondo.jpg')"
        }}
      />

      {/* Efectos de luz */}
      <div className="auth-light auth-light-1" />
      <div className="auth-light auth-light-2" />

      {/* Grid decorativo */}
      <div className="auth-grid" />

      {/* Card principal */}
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo-wrap">
          <img
            src="/logo.png"
            alt="Logo"
            className="auth-logo-img"
          />
        </div>

        {/* Ornamento */}
        <div className="auth-ornament">
          <div className="auth-orn-line" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-diamond" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-line" />
        </div>

        {/* Vista */}
        {!isForgot ? (
          <Login
            onForgot={() => setIsForgot(true)}
          />
        ) : (
          <ForgotPasswordForm
            onBack={() => setIsForgot(false)}
          />
        )}

      </div>
    </div>
  );
};