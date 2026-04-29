import { useState } from "react"
import { LoginForm } from "../components/LoginForm.jsx"
/*import { ForgotPassword } from "../components/ForgotPassword.jsx"*/

export const AuthPage = () => {
    const [isForgot, setIsForgot] = useState(false);

    return (
        // Contenedor principal que se centra gracias al CSS del body
        <div className="auth-card">
            {/* 1. SECCIÓN DE LOGIN */}
            {!isForgot && (
                <>
                    {/* Título limpio con letter-spacing ajustado */}
                    <h1 className="auth-title">Bienvenido de Nuevo</h1>
                    
                    {/* Subtítulo limpio y proporcional */}
                    <p className="auth-subtitle">Ingresa a tu cuenta de administrador</p>
                    
                    {/* El formulario de login (que debe usar los inputs y botón del CSS) */}
                    <LoginForm onForgot={() => setIsForgot(true)} />
                </>
            )}

            {/* 2. SECCIÓN DE RECUPERAR CONTRASEÑA */}
            {isForgot && (
                <>
                    <h1 className="auth-title">Recuperar Contraseña</h1>
                    <p className="auth-subtitle">Ingresa tu email para recibir instrucciones</p>
                    
                    {/* El formulario de recuperación */}
                    <ForgotPasswordForm onBack={() => setIsForgot(false)} />
                </>
            )}
        </div>
    );
};