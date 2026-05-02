import { useState } from "react";
import { LoginForm } from "../components/LoginForm.jsx";
import logo from "../../../assets/img/Logo.png";
import fondo from "../../../assets/img/Fondo.jpg";

const validateForgot = ({ email }) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Ingresa un correo válido.";
  }
  return errors;
};

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleForgotBlur = () => {
    setForgotTouched(true);
    setForgotErrors(validateForgot({ email: forgotEmail }));
  };

  const handleForgotChange = (value) => {
    setForgotEmail(value);
    if (forgotTouched) {
      setForgotErrors(validateForgot({ email: value }));
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotTouched(true);
    const errors = validateForgot({ email: forgotEmail });
    setForgotErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setForgotLoading(true);
    // Reemplaza esto con tu llamada real al API
    await new Promise((r) => setTimeout(r, 1500));
    setForgotLoading(false);
    setForgotSuccess(true);
  };

  const handleBackToLogin = () => {
    setIsForgot(false);
    setForgotEmail("");
    setForgotErrors({});
    setForgotTouched(false);
    setForgotSuccess(false);
  };

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

            {forgotSuccess ? (
              <div className="auth-success-box" role="status">
                <span style={{ fontSize: "28px" }}></span>
                <p style={{ margin: "8px 0 0", fontWeight: 600 }}>¡Correo enviado!</p>
                <p style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>
                  Revisa tu bandeja de entrada y sigue las instrucciones.
                </p>
              </div>
            ) : (
              <form
                className="auth-form"
                noValidate
                onSubmit={handleForgotSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <input
                  type="email"
                  placeholder="correo@example.com"
                  className="input-auth"
                  value={forgotEmail}
                  onChange={(e) => handleForgotChange(e.target.value)}
                  onBlur={handleForgotBlur}
                  disabled={forgotLoading}
                  aria-invalid={!!forgotErrors.email}
                  aria-describedby="err-forgot-email"
                  style={{
                    border: forgotTouched && forgotErrors.email
                      ? "1.5px solid #ff4d4d"
                      : "1.5px solid transparent",
                    transition: "border 0.2s",
                  }}
                />
                {forgotTouched && forgotErrors.email && (
                  <p id="err-forgot-email" className="auth-field-error">
                    ⚠ {forgotErrors.email}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn-login"
                  disabled={forgotLoading}
                  aria-busy={forgotLoading}
                  style={{ marginTop: "12px" }}
                >
                  {forgotLoading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <span className="btn-spinner" />
                      Enviando...
                    </span>
                  ) : (
                    "Mandar Token"
                  )}
                </button>
              </form>
            )}

            <p style={{ marginTop: "15px", fontSize: "14px" }}>
              ¿Recordaste tu contraseña?{" "}
              <span
                style={{ color: "#d4af37", cursor: "pointer" }}
                onClick={handleBackToLogin}
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