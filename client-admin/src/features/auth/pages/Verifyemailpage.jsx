import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthFrame } from "../components/AuthFrame";
import { resendVerificationEmail, verifyEmail } from "../../../services/auth.service";
import { useAuthStore } from "../store/authStore";

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const token = searchParams.get("token") || "";
  const initialEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState(token ? "loading" : "missing-token");
  const [message, setMessage] = useState("");
  const [resendStatus, setResendStatus] = useState("idle");

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (!token) return;

    let active = true;
   const run = async () => {
  setStatus("loading");

  try {
    const response = await verifyEmail(token);

    if (!active) return;

    if (!response?.success) {
      throw new Error(
        response?.message || "El enlace de verificacion expiro o no es valido."
      );
    }

    setStatus("success");
    setMessage(
      response.message ||
      "Correo verificado. Tu cuenta Aurea ya esta activa."
    );
  } catch (error) {
    if (!active) return;

    setStatus("error");
    setMessage(
      error.userMessage ||
      error.message ||
      "El enlace de verificacion expiro o no es valido."
    );
  }
};

run();

return () => {
  active = false;
};

    run();
    return () => {
      active = false;
    };
  }, [token]);

  const handleResend = async (event) => {
    event.preventDefault();
    setResendStatus("loading");
    setMessage("");
    try {
      const response = await resendVerificationEmail(email.trim());
      setResendStatus("success");
      setMessage(response?.message || "Te enviamos un nuevo enlace de verificacion.");
    } catch (error) {
      setResendStatus("error");
      setMessage(error.userMessage || "No pudimos reenviar el correo de verificacion.");
    }
  };

  return (
    <AuthFrame>
      <div className="auth-content">
        <span className="auth-eyebrow">Verificacion de correo</span>
        <h1 className="auth-title">
          {status === "success" ? "Correo verificado" : status === "loading" ? "Verificando..." : "Activa tu cuenta"}
        </h1>
        <p className="auth-subtitle">
          {status === "success"
            ? "Tu cuenta esta lista. Ya puedes iniciar sesion y disfrutar Aurea."
            : "Confirmamos que el correo te pertenece para proteger tus reservas, pedidos y recompensas."}
        </p>

        {status === "loading" && (
          <div className="auth-success-box auth-message-box">
            <span className="btn-spinner" />
            <p>Estamos validando el enlace seguro...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="auth-success-box auth-message-box">
              <span className="auth-success-mark">OK</span>
              <p>{message}</p>
            </div>
            <button type="button" className="btn-login" onClick={() => navigate("/login", { replace: true })}>
              Ir a iniciar sesion
            </button>
          </>
        )}

        {(status === "error" || status === "missing-token" || resendStatus === "error" || resendStatus === "success") && (
          <div className={resendStatus === "success" ? "auth-success-box auth-message-box" : "auth-api-error auth-message-box"}>
            {message || "El enlace no contiene un token valido o ya expiro."}
          </div>
        )}

        {status !== "success" && (
          <form className="auth-form auth-resend-form" onSubmit={handleResend}>
            <label className="auth-field">
              <span>Reenviar correo de verificacion</span>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={resendStatus === "loading"}
                autoComplete="email"
              />
            </label>
            <button type="submit" className="auth-secondary-button" disabled={resendStatus === "loading" || !email}>
              {resendStatus === "loading" ? "Enviando..." : "Reenviar correo"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Ya verificaste tu cuenta? <Link to="/login">Iniciar sesion</Link>
        </p>
      </div>
    </AuthFrame>
  );
};
