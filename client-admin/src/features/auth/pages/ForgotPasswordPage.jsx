import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthFrame } from "../components/AuthFrame";
import { requestPasswordReset } from "../../../services/auth.service";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("Ingresa un correo valido para enviarte el enlace seguro.");
      return;
    }

    setStatus("loading");
    try {
      const response = await requestPasswordReset(email.trim());
      setStatus("success");
      setMessage(response?.message || "Te enviamos un enlace temporal para restablecer tu contrasena.");
    } catch (error) {
      setStatus("error");
      setMessage(error.userMessage || "No pudimos procesar la solicitud. Intenta de nuevo.");
    }
  };

  return (
    <AuthFrame>
      <div className="auth-content">
        <span className="auth-eyebrow">Recuperacion segura</span>
        <h1 className="auth-title">Recuperar contrasena</h1>
        <p className="auth-subtitle">
          Escribe el correo asociado a tu cuenta Aurea. Te enviaremos un enlace con expiracion para crear una nueva contrasena.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={status === "loading"}
            autoComplete="email"
          />

          <button type="submit" className="btn-login" disabled={status === "loading"}>
            {status === "loading" ? (
              <span className="auth-button-loading"><span className="btn-spinner" />Enviando...</span>
            ) : (
              "Enviar enlace"
            )}
          </button>
        </form>

        {status === "success" && (
          <div className="auth-success-box auth-message-box">
            <span className="auth-success-mark">OK</span>
            <p>{message}</p>
          </div>
        )}

        {status === "error" && <div className="auth-api-error auth-message-box">{message}</div>}

        <p className="auth-switch">
          Ya recordaste tu contrasena? <Link to="/login">Iniciar sesion</Link>
        </p>
      </div>
    </AuthFrame>
  );
};
