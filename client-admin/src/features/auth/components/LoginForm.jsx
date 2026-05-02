import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

// Validación de campos
const PASSWORD_MIN_LENGTH = 6;

const validate = ({ emailOrUsername, password }) => {
    const errors = {};
    if (!emailOrUsername.trim()) {
        errors.emailOrUsername = 'El usuario o correo es obligatorio.';
    }
    if (!password) {
        errors.password = 'La contraseña es obligatoria.';
    } else if (password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }
    return errors;
};

// Pasamos onForgot como prop para que funcione el cambio de vista en AuthPage
export const LoginForm = ({ onForgot }) => {
    const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const login = useAuthStore((state) => state.login);
    const { loading, error } = useAuthStore();
    const clearError = useAuthStore((state) => state.clearError);

    useEffect(() => { clearError(); }, []);

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const errors = validate(formData);
        setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
    };

    const handleChange = (field, value) => {
        const updated = { ...formData, [field]: value };
        setFormData(updated);
        if (touched[field]) {
            const errors = validate(updated);
            setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
        }
    };

    const inputStyle = (field) => ({
        border: touched[field] && fieldErrors[field]
            ? '1.5px solid #ff4d4d'
            : '1.5px solid transparent',
        transition: 'border 0.2s',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar todos los campos antes de enviar
        setTouched({ emailOrUsername: true, password: true });
        const errors = validate(formData);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const result = await login(formData);
        if (result.success) {
            // Usamos window.location para un refresco limpio o podrías usar useNavigate
            window.location.href = '/dashboard';
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Usuario o Email" 
                className="input-auth" // Si quieres agregar estilos específicos en index.css
                style={inputStyle('emailOrUsername')}
                value={formData.emailOrUsername}
                onChange={(e) => handleChange('emailOrUsername', e.target.value)}
                onBlur={() => handleBlur('emailOrUsername')}
                disabled={loading}
            />
            {touched.emailOrUsername && fieldErrors.emailOrUsername && (
                <p className="auth-field-error">⚠ {fieldErrors.emailOrUsername}</p>
            )}

            <input 
                type="password" 
                placeholder="Contraseña" 
                className="input-auth"
                style={inputStyle('password')}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
            />
            {touched.password && fieldErrors.password && (
                <p className="auth-field-error">⚠ {fieldErrors.password}</p>
            )}
            
            {/* Link dorado para recuperar contraseña */}
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <span 
                    onClick={!loading ? onForgot : undefined} 
                    style={{ 
                        color: 'var(--dorado-principal)', 
                        cursor: loading ? 'not-allowed' : 'pointer', 
                        fontSize: '14px',
                        textDecoration: 'underline',
                        opacity: loading ? 0.6 : 1,
                    }}
                >
                    ¿Olvidaste tu contraseña?
                </span>
            </div>

            {/* Botón con tu clase de index.css */}
            <button 
                type="submit" 
                className="btn-login" 
                disabled={loading}
                aria-busy={loading}
            >
                {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span className="btn-spinner" />
                        Entrando...
                    </span>
                ) : (
                    'Iniciar Sesión'
                )}
            </button>

            {error && (
                <p style={{ 
                    color: '#ff4d4d', 
                    fontSize: '14px', 
                    textAlign: 'center', 
                    marginTop: '10px',
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    padding: '5px',
                    borderRadius: '4px'
                }}>
                    {error}
                </p>
            )}
        </form>
    );
};