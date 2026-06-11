import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthFrame } from "../components/AuthFrame";
import { resetPassword } from "../../../services/auth.service";

const validatePassword = (password) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /\d/.test(password),
});

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const checks = useMemo(() => validatePassword(formData.password), [formData.password]);
  const strongPassword = Object.values(checks).every(Boolean);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setMessage("");
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setMessage("El enlace no contiene un token valido o ya expiro.");
      return;
    }
    if (!strongPassword) {
      setStatus("error");
      setMessage("La contrasena debe cumplir todos los requisitos de seguridad.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setStatus("error");
      setMessage("Las contrasenas no coinciden.");
      return;
    }

    setStatus("loading");
    try {
      const response = await resetPassword(token, formData.password, formData.confirmPassword);
      setStatus("success");
      setMessage(response?.message || "Tu contrasena fue actualizada correctamente.");
    } catch (error) {
      setStatus("error");
      setMessage(error.userMessage || "No pudimos actualizar tu contrasena. Solicita un enlace nuevo.");
    }
  };

  return (
    <AuthFrame>
      <div className="auth-content">
        <span className="auth-eyebrow">Cuenta Aurea</span>
        <h1 className="auth-title">Nueva contrasena</h1>
        <p className="auth-subtitle">
          Crea una contrasena segura. El enlace es temporal y solo puede utilizarse una vez.
        </p>

        {status !== "success" && <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <input
            type="password"
            placeholder="Nueva contrasena"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            disabled={status === "loading" || status === "success"}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirmar contrasena"
            value={formData.confirmPassword}
            onChange={(event) => updateField("confirmPassword", event.target.value)}
            disabled={status === "loading" || status === "success"}
            autoComplete="new-password"
          />

          <div className="auth-password-rules" aria-label="Requisitos de contrasena">
            <span className={checks.length ? "is-ok" : ""}>8 caracteres</span>
            <span className={checks.upper ? "is-ok" : ""}>Mayuscula</span>
            <span className={checks.lower ? "is-ok" : ""}>Minuscula</span>
            <span className={checks.number ? "is-ok" : ""}>Numero</span>
          </div>

          <button type="submit" className="btn-login" disabled={status === "loading" || status === "success"}>
            {status === "loading" ? (
              <span className="auth-button-loading"><span className="btn-spinner" />Actualizando...</span>
            ) : (
              "Actualizar contrasena"
            )}
          </button>
        </form>}

        {status === "success" && (
          <div className="auth-reset-success">
            <div className="auth-success-box auth-message-box">
              <span className="auth-success-mark"><i className="ri-check-line" /></span>
              <h2>Contrasena actualizada correctamente</h2>
              <p>{message}</p>
              <p className="auth-success-detail">Tu acceso anterior fue protegido. Ya puedes entrar con tu nueva contrasena.</p>
            </div>
            <Link className="btn-login auth-button-link" to="/login">Iniciar sesion</Link>
          </div>
        )}
        {status === "error" && <div className="auth-api-error auth-message-box">{message}</div>}

        {status !== "success" && <p className="auth-switch">
          Necesitas otro enlace? <Link to="/forgot-password">Solicitar recuperacion</Link>
        </p>}
      </div>
    </AuthFrame>
  );
};
