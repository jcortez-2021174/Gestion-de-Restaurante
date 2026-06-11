import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const validate = ({ emailOrUsername, password }) => {
  const errors = {};
  if (!emailOrUsername.trim()) errors.emailOrUsername = "El usuario o correo es obligatorio.";
  if (!password) errors.password = "La contrasena es obligatoria.";
  else if (password.length < 6) errors.password = "La contrasena debe tener al menos 6 caracteres.";
  return errors;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const login = useAuthStore((state) => state.login);
  const { loading, error } = useAuthStore();
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
    const errors = validate(formData);
    setFieldErrors((current) => ({ ...current, [field]: errors[field] }));
  };

  const handleChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (touched[field]) {
      const errors = validate(next);
      setFieldErrors((current) => ({ ...current, [field]: errors[field] }));
    }
  };

  const inputStyle = (field) => ({
    border: touched[field] && fieldErrors[field]
      ? "1.5px solid #ff4d4d"
      : "1.5px solid transparent",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ emailOrUsername: true, password: true });
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await login(formData);
    if (result.success) {
      const user = useAuthStore.getState().user;
      navigate(user?.role === "ADMIN_ROLE" ? "/dashboard" : "/home", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <input
        type="text"
        placeholder="Usuario o email"
        className="input-auth"
        style={inputStyle("emailOrUsername")}
        value={formData.emailOrUsername}
        onChange={(event) => handleChange("emailOrUsername", event.target.value)}
        onBlur={() => handleBlur("emailOrUsername")}
        disabled={loading}
        autoComplete="username"
      />
      {touched.emailOrUsername && fieldErrors.emailOrUsername && (
        <p className="auth-field-error">{fieldErrors.emailOrUsername}</p>
      )}

      <input
        type="password"
        placeholder="Contrasena"
        className="input-auth"
        style={inputStyle("password")}
        value={formData.password}
        onChange={(event) => handleChange("password", event.target.value)}
        onBlur={() => handleBlur("password")}
        disabled={loading}
        autoComplete="current-password"
      />
      {touched.password && fieldErrors.password && (
        <p className="auth-field-error">{fieldErrors.password}</p>
      )}

      <div className="auth-inline-action">
        <Link className="auth-forgot" to="/forgot-password">
          Olvidaste tu contrasena?
        </Link>
      </div>

      <button type="submit" className="btn-login" disabled={loading} aria-busy={loading}>
        {loading ? (
          <span className="auth-button-loading"><span className="btn-spinner" />Entrando...</span>
        ) : (
          "Iniciar sesion"
        )}
      </button>

      {error && <div className="auth-api-error">{error}</div>}

      <p className="auth-switch">
        No tienes cuenta? <Link to="/register">Crear cuenta</Link>
      </p>
    </form>
  );
};
