import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { validateRegistration } from "../registration.validation";
import "../styles/auth.css";

const INITIAL_FORM = {
  name: "",
  surname: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  profilePicture: null,
};

const FIELD_LABELS = {
  name: "Nombre",
  surname: "Apellido",
  username: "Username",
  email: "Correo electronico",
  phone: "Telefono",
  password: "Contrasena",
  confirmPassword: "Confirmar contrasena",
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateField = (field, values) => {
    const errors = validateRegistration(values);
    setFieldErrors((current) => ({ ...current, [field]: errors[field] }));
  };

  const handleChange = (field, value) => {
    const nextValues = { ...formData, [field]: value };
    setFormData(nextValues);
    clearError();

    if (touched[field]) validateField(field, nextValues);
    if (field === "password" && touched.confirmPassword) {
      validateField("confirmPassword", nextValues);
    }
  };

  const handleBlur = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
    validateField(field, formData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateRegistration(formData);
    const allTouched = Object.keys(INITIAL_FORM).reduce(
      (result, field) => ({ ...result, [field]: true }),
      {},
    );

    setTouched(allTouched);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const result = await register({
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone,
      profilePicture: formData.profilePicture,
    });

    if (result.success) {
      setSuccess(result.data);
      setFormData(INITIAL_FORM);
    }
  };

  const renderFieldError = (field) => {
    if (!touched[field] || !fieldErrors[field]) return null;

    return (
      <p id={`register-${field}-error`} className="auth-field-error" role="alert">
        {fieldErrors[field]}
      </p>
    );
  };

  const inputProps = (field) => ({
    id: `register-${field}`,
    name: field,
    className: "input-auth",
    disabled: loading,
    "aria-invalid": Boolean(touched[field] && fieldErrors[field]),
    "aria-describedby": fieldErrors[field] ? `register-${field}-error` : undefined,
    onBlur: () => handleBlur(field),
  });

  return (
    <div className="auth-page auth-page-scroll">
      <div className="auth-bg" style={{ backgroundImage: "url('/Fondo.jpg')" }} />
      <div className="auth-light auth-light-1" />
      <div className="auth-light auth-light-2" />
      <div className="auth-grid" />

      <main className="auth-card auth-card-register">
        <div className="auth-logo-wrap auth-logo-register">
          <img src="/logo.png" alt="Aurea Restaurant" className="auth-logo-img" />
        </div>

        <div className="auth-ornament">
          <div className="auth-orn-line" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-diamond" />
          <div className="auth-orn-dot" />
          <div className="auth-orn-line" />
        </div>

        {success ? (
          <section className="auth-register-success" aria-live="polite">
            <div className="auth-success-box">
              <span className="auth-success-mark" aria-hidden="true">OK</span>
              <h1 className="auth-title">Cuenta creada</h1>
              <p>{success.message || "Tu cuenta fue registrada exitosamente."}</p>
              <p className="auth-success-user">
                Bienvenido, {success.user?.name || "tu cuenta esta lista"}.
              </p>
            </div>
            <Link className="btn-login auth-button-link" to="/login">
              Iniciar sesion
            </Link>
          </section>
        ) : (
          <>
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">
              Registrate para disfrutar la experiencia Aurea
            </p>

            <form className="auth-form auth-register-form" noValidate onSubmit={handleSubmit}>
              <div className="auth-form-grid">
                {["name", "surname", "username", "email", "phone"].map((field) => (
                  <div
                    className={`auth-field ${field === "email" ? "auth-field-wide" : ""}`}
                    key={field}
                  >
                    <label htmlFor={`register-${field}`}>{FIELD_LABELS[field]}</label>
                    <input
                      {...inputProps(field)}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      autoComplete={
                        field === "email" ? "email" : field === "phone" ? "tel" : field
                      }
                      maxLength={field === "phone" ? 8 : undefined}
                      inputMode={field === "phone" ? "numeric" : undefined}
                      value={formData[field]}
                      onChange={(event) => {
                        const value = field === "phone"
                          ? event.target.value.replace(/\D/g, "").slice(0, 8)
                          : event.target.value;
                        handleChange(field, value);
                      }}
                    />
                    {renderFieldError(field)}
                  </div>
                ))}

                {["password", "confirmPassword"].map((field) => (
                  <div className="auth-field" key={field}>
                    <label htmlFor={`register-${field}`}>{FIELD_LABELS[field]}</label>
                    <input
                      {...inputProps(field)}
                      type="password"
                      autoComplete="new-password"
                      value={formData[field]}
                      onChange={(event) => handleChange(field, event.target.value)}
                    />
                    {renderFieldError(field)}
                  </div>
                ))}

                <div className="auth-field auth-field-wide">
                  <label htmlFor="register-profilePicture">
                    Foto de perfil <span className="auth-optional">(opcional)</span>
                  </label>
                  <label className="auth-file-input" htmlFor="register-profilePicture">
                    <span>{formData.profilePicture?.name || "Seleccionar JPG, PNG o WebP"}</span>
                    <strong>Examinar</strong>
                  </label>
                  <input
                    id="register-profilePicture"
                    className="auth-file-native"
                    type="file"
                    name="profilePicture"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    disabled={loading}
                    onChange={(event) => handleChange("profilePicture", event.target.files?.[0] || null)}
                    onBlur={() => handleBlur("profilePicture")}
                    aria-invalid={Boolean(touched.profilePicture && fieldErrors.profilePicture)}
                    aria-describedby={
                      fieldErrors.profilePicture ? "register-profilePicture-error" : undefined
                    }
                  />
                  {renderFieldError("profilePicture")}
                </div>
              </div>

              <p className="auth-password-help">
                Minimo 8 caracteres, con mayuscula, minuscula y numero.
              </p>

              {error && (
                <div className="auth-api-error" role="alert" aria-live="assertive">
                  {error}
                </div>
              )}

              <button className="btn-login" type="submit" disabled={loading} aria-busy={loading}>
                {loading ? (
                  <span className="auth-button-loading">
                    <span className="btn-spinner" />
                    Creando cuenta...
                  </span>
                ) : (
                  "Crear cuenta"
                )}
              </button>
            </form>

            <p className="auth-switch">
              Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
};
