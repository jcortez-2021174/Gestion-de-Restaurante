    import { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { useAuthStore } from "../store/authStore";
    import "../styles/auth.css";

    export const VerifyEmailPage = () => {
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    useEffect(() => {
        logout();
        if (!token) {
        setStatus("error");
        setMessage("No se encontró ningún token de verificación en el enlace.");
        }
    }, [token]);

    const handleVerify = async () => {
        setStatus("loading");
        try {
        const res = await fetch("http://localhost:5022/api/v1/auth/verify-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
            setStatus("success");
            setMessage(data.message || "Email verificado exitosamente.");
        } else {
            throw new Error(data.message || "No se pudo verificar el correo.");
        }
        } catch (err) {
        setStatus("error");
        setMessage(err.message || "El enlace puede haber expirado o ser inválido.");
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-bg" style={{ backgroundImage: "url('/Fondo.jpg')" }} />
        <div className="auth-light auth-light-1" />
        <div className="auth-light auth-light-2" />

        <div className="auth-card" style={{ textAlign: "center" }}>

            {/* Logo */}
            <div className="auth-logo-wrap">
            <img src="/logo.png" alt="Logo" className="auth-logo-img" />
            </div>

            {/* Ornamento */}
            <div className="auth-ornament">
            <div className="auth-orn-line" />
            <div className="auth-orn-dot" />
            <div className="auth-orn-diamond" />
            <div className="auth-orn-dot" />
            <div className="auth-orn-line" />
            </div>

            

            {/* Título */}
            <h2 className="auth-title" style={{ fontSize: 26, marginBottom: 10 }}>
            {status === "success"
                ? "¡Correo Verificado!"
                : status === "error"
                ? "Algo ha fallado"
                : "Verificar Correo"}
            </h2>

            {/* Subtítulo */}
            <p className="auth-subtitle">
            {status === "success"
                ? "Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesión."
                : status === "error"
                ? "No pudimos verificar tu correo electrónico."
                : "Haz clic en el botón para confirmar tu dirección de correo y activar tu cuenta."}
            </p>

            {/* Mensaje de API */}
            {message && status === "success" && (
            <div className="auth-success-box" style={{ marginBottom: 20 }}>
                <span style={{ color: "#50c878", fontSize: 14 }}>{message}</span>
            </div>
            )}

            {message && status === "error" && (
            <div className="auth-api-error" style={{ marginBottom: 20, justifyContent: "center" }}>
                <span>{message}</span>
            </div>
            )}

            {/* Botón principal */}
            {status !== "success" && (
            <button
                className="btn-login"
                onClick={handleVerify}
                disabled={status === "loading" || !token}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
                {status === "loading" ? (
                <>
                    <div className="btn-spinner" />
                    Verificando...
                </>
                ) : (
                "Verificar sesión"
                )}
            </button>
            )}

            {/* Botón ir a login tras éxito */}
            {status === "success" && (
            <button
                className="btn-login"
                onClick={() => {
                logout();
                localStorage.removeItem("auth-restaurante-Aurea");
                navigate("/login", { replace: true });
                }}
            >
                Ir a iniciar sesión →
            </button>
            )}

            {/* Botón reintentar tras error */}
            {status === "error" && token && (
            <button
                className="btn-login"
                onClick={handleVerify}
                style={{ marginTop: 10, background: "rgba(255,255,255,0.08)", color: "#b5b5b5", boxShadow: "none" }}
            >
                Reintentar
            </button>
            )}

        </div>
        </div>
    );
    };