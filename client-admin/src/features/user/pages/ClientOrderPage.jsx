import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useOrders } from "../../../context/OrdersContext";
import "../styles/dashboard.css";

import "../styles/orders.css"; 

export const ClientOrderPage = () => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [tipPercentage, setTipPercentage] = useState(15); 
    // Añadido: estado para controlar si estamos en modo "propina personalizada"
    const [isCustomTip, setIsCustomTip] = useState(false);
    const [customTipValue, setCustomTipValue] = useState("");

    // Estados para cupones, notas y modal de cancelación
    const [couponInput, setCouponInput] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0); 
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [orderNotes, setOrderNotes] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [reasonError, setReasonError] = useState("");

    // Estado del carrito sincronizado con los platos de Áurea
    const [cartProducts, setCartProducts] = useState([
        {
            id: 1,
            nombre: "Costillas de Cordero a la Parrilla",
            descripcion: "Jugosas y perfectamente asadas, acompañadas de guarniciones frescas.",
            precio: 165.00,
            cantidad: 1,
            imagen: "/plato1.jpeg" 
        },
        {
            id: 2,
            nombre: "Brochetas de Cordero a la Menta y Limón",
            descripcion: "Delicadas brochetas con un toque fresco de menta y limón.",
            precio: 140.00,
            cantidad: 2,
            imagen: "/plato2.jpeg" 
        },
        {
            id: 3,
            nombre: "Tarta de Cordero y Queso de Cabra",
            descripcion: "Mezcla perfecta de cordero y queso de cabra en una base crujiente.",
            precio: 120.00,
            cantidad: 1,
            imagen: "/plato3.jpeg" 
        }
    ]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("auth-restaurante-Aurea");
        navigate("/login", { replace: true });
    };

    const updateCantidad = (id, incremento) => {
        setCartProducts(prev => prev.map(item => {
            if (item.id === id) {
                const nuevaCantidad = item.cantidad + incremento;
                return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
            }
            return item;
        }));
    };

    const eliminarProducto = (id) => {
        setCartProducts(prev => prev.filter(item => item.id !== id));
    };

    const applyCoupon = () => {
        setCouponError("");
        setCouponSuccess("");
        
        if (couponInput.trim().toUpperCase() === "AUREA10") {
            setAppliedDiscount(10); 
            setCouponSuccess("¡Cupón del 10% aplicado con éxito!");
        } else if (couponInput.trim() === "") {
            setCouponError("Por favor, ingresa un código.");
        } else {
            setCouponError("El cupón ingresado no es válido.");
            setAppliedDiscount(0);
        }
    };

    const handleConfirmCancel = () => {
        const palabras = cancelReason.trim().split(/\s+/).filter(p => p.length > 0);
        
        if (palabras.length < 5) {
            setReasonError(`Llevas ${palabras.length} palabras. Se requiere un motivo de al menos 5 palabras.`);
            return;
        }

        alert(`Pedido cancelado exitosamente. Motivo: "${cancelReason}"`);
        setCartProducts([]); 
        setShowCancelModal(false);
        setCancelReason("");
        setReasonError("");
    };

    // Cálculos económicos de la orden
    const subtotal = cartProducts.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const descuentoMonetario = subtotal * (appliedDiscount / 100);
    const subtotalConDescuento = subtotal - descuentoMonetario;
    
    const envio = subtotal > 0 ? 15.00 : 0;
    const totalInicial = subtotalConDescuento + envio;
    
    // Cálculo de propina lógica
    const activeTip = isCustomTip ? parseFloat(customTipValue) || 0 : tipPercentage;
    const montoPropina = (totalInicial * (activeTip / 100));
    const totalAPagar = totalInicial + montoPropina;

    return (
        <div className="container" style={{ background: '#060606', minHeight: '100vh', color: '#fff', position: 'relative' }}>
            
            {/* --- SIDEBAR DE CLIENTE (TU REFERENCIA) --- */}
            <aside className="sidebar">
                <div className="logo-box">
                    <img src="/logo.png" alt="Aurea Logo" />
                </div>

                <ul className="menu">
                    <Link to="/user/menu" className="menu-link">
                        <li>
                            <i className="ri-restaurant-line"></i>
                            Menú
                        </li>
                    </Link>
                    <Link to="/user/reservations" className="menu-link">
                        <li>
                            <i className="ri-calendar-line"></i>
                            Reservas
                        </li>
                    </Link>
                    <Link to="/user/orders" className="menu-link">
                        <li className="active">
                            <i className="ri-motorbike-line"></i>
                            Pedidos
                            {cartProducts.length > 0 && (
                                <span className="menu-badge">{cartProducts.length}</span>
                            )}
                        </li>
                    </Link>
                    <Link to="/user/nosotros" className="menu-link">
                        <li>
                            <i className="ri-group-line"></i>
                            Sobre Nosotros
                        </li>
                    </Link>
                    <Link to="/user/contacto" className="menu-link">
                        <li>
                            <i className="ri-contacts-book-line"></i>
                            Contacto
                        </li>
                    </Link>
                </ul>

                <div className="sidebar-contact">
                    <p className="sidebar-contact-title">CONTÁCTANOS</p>
                    <div className="sidebar-contact-item">
                        <i className="ri-phone-line"></i>
                        <span>+502 1234 5678</span>
                    </div>
                    <div className="sidebar-contact-item">
                        <i className="ri-mail-line"></i>
                        <span>hola@aurea.com</span>
                    </div>
                    <div className="sidebar-contact-item">
                        <i className="ri-map-pin-line"></i>
                        <span>5ta avenida 12-34, Zona 10, Ciudad de Guatemala</span>
                    </div>
                </div>

                <div className="sidebar-social">
                    <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
                    <a href="#" className="social-icon"><i className="ri-instagram-line"></i></a>
                    <a href="#" className="social-icon"><i className="ri-whatsapp-line"></i></a>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main" style={{ padding: '30px' }}>
                
                {/* FLOATING USER BOX */}
                <div className="user-box user-box-floating" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
                    <div className="notification" style={{ position: 'relative', cursor: 'pointer' }}>
                        <i className="ri-notification-3-line" style={{ fontSize: '1.3rem' }}></i>
                        <span className="badge" style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#d4af37', color: '#000', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>2</span>
                    </div>
                    <div className="divider" style={{ width: '1px', height: '25px', background: '#333' }}></div>
                    <div className="user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="ri-user-line" style={{ fontSize: '1.2rem', color: '#d4af37' }}></i>
                        <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user?.username || "emiliobol12"}</span>
                            <small style={{ color: '#666', fontSize: '0.75rem' }}>Cliente Premium</small>
                        </div>
                        <button onClick={handleLogout} className="btn-mini" style={{ marginLeft: "10px", padding: "8px 12px", background: '#111', border: '1px solid #222', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}>
                            <i className="ri-logout-box-line"></i>
                        </button>
                    </div>
                </div>

                <div className="header" style={{ marginBottom: '30px' }}>
                    <h1 style={{ fontFamily: 'Georgia, serif', color: '#d4af37', fontSize: '2.5rem', marginBottom: '5px' }}>
                        Carrito de compras
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '0.95rem' }}>Revisa tus productos seleccionados del menú de Áurea.</p>
                </div>

                {cartProducts.length === 0 ? (
                    <div className="card" style={{ background: '#0b0b0b', border: '1px solid #1a1a1a', padding: '60px', textAlign: 'center', borderRadius: '12px' }}>
                        <i className="ri-shopping-bag-line" style={{ fontSize: '4rem', color: '#d4af37', marginBottom: '20px', display: 'block' }}></i>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Tu carrito está vacío</h3>
                        <p style={{ color: '#666', marginBottom: '25px' }}>Regresa al menú para seleccionar el mejor arte del cordero.</p>
                        <Link to="/user/menu" className="btn-gold" style={{ padding: '10px 25px', textDecoration: 'none', color: '#000', background: '#d4af37', borderRadius: '6px', fontWeight: 'bold' }}>Explorar Menú</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px', alignItems: 'start' }}>
                        
                        <div>
                            <div style={{ background: '#0b0b0b', borderRadius: '12px', border: '1px solid #1a1a1a', padding: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 0.3fr', paddingBottom: '15px', borderBottom: '1px solid #222', color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    <span>Producto</span>
                                    <span style={{ textAlign: 'center' }}>Precio</span>
                                    <span style={{ textAlign: 'center' }}>Cantidad</span>
                                    <span style={{ textAlign: 'right' }}>Total</span>
                                    <span></span>
                                </div>

                                {cartProducts.map((item) => (
                                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 0.3fr', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #161616' }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <img src={item.imagen} alt={item.nombre} style={{ width: '85px', height: '70px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #222' }} />
                                            <div>
                                                <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px', fontWeight: '600' }}>{item.nombre}</h4>
                                                <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: '1.3' }}>{item.descripcion}</p>
                                            </div>
                                        </div>
                                        <span style={{ color: '#ccc', textAlign: 'center' }}>Q{item.precio.toFixed(2)}</span>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                                            <button onClick={() => updateCantidad(item.id, -1)} style={{ background: '#111', border: '1px solid #333', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>{item.cantidad}</span>
                                            <button onClick={() => updateCantidad(item.id, 1)} style={{ background: '#111', border: '1px solid #333', color: '#fff', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                                        </div>
                                        <span style={{ textAlign: 'right', color: '#d4af37', fontWeight: 'bold' }}>Q{(item.precio * item.cantidad).toFixed(2)}</span>
                                        <button onClick={() => eliminarProducto(item.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', textAlign: 'right' }}>
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ background: '#0b0b0b', borderRadius: '12px', border: '1px solid #1a1a1a', padding: '20px' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: '#fff' }}>Notas para tu pedido</h4>
                                    <textarea 
                                        value={orderNotes} 
                                        onChange={(e) => setOrderNotes(e.target.value)}
                                        placeholder="Ej. Término de la carne de cordero, especificaciones o alergias..." 
                                        style={{ width: '93%', height: '70px', background: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', padding: '12px', resize: 'none' }} 
                                    />
                                </div>

                                <div style={{ background: '#0b0b0b', borderRadius: '12px', border: '1px solid #1a1a1a', padding: '20px' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: '#fff' }}>Cupón de descuento</h4>
                                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '10px' }}>Usa el código promocional <strong style={{ color: '#d4af37' }}>AUREA10</strong></p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input 
                                            type="text" 
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            placeholder="Ingresa tu cupón" 
                                            style={{ flex: '1', background: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', padding: '0 12px', height: '40px' }} 
                                        />
                                        <button onClick={applyCoupon} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#d4af37', padding: '0 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Aplicar</button>
                                    </div>
                                    {couponError && <p style={{ color: '#f44336', fontSize: '0.8rem', marginTop: '8px' }}>⚠️ {couponError}</p>}
                                    {couponSuccess && <p style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '8px' }}>✅ {couponSuccess}</p>}
                                </div>
                            </div>
                        </div>

                        <aside style={{ background: '#0b0b0b', borderRadius: '12px', border: '1px solid #1a1a1a', padding: '25px' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontFamily: 'Georgia, serif' }}>Resumen del pedido</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '12px' }}>
                                <span>Subtotal Original</span>
                                <span>Q{subtotal.toFixed(2)}</span>
                            </div>

                            {appliedDiscount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4caf50', marginBottom: '12px' }}>
                                    <span>Descuento ({appliedDiscount}%)</span>
                                    <span>- Q{descuentoMonetario.toFixed(2)}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '20px' }}>
                                <span>Envío</span>
                                <span>Q{envio.toFixed(2)}</span>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <span style={{ fontSize: '0.95rem', color: '#fff' }}>Propina opcional</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginTop: '10px' }}>
                                    {[10, 15, 20].map((pct) => (
                                        <button key={pct} onClick={() => { setIsCustomTip(false); setTipPercentage(pct); }} style={{ background: (!isCustomTip && tipPercentage === pct) ? 'none' : '#111', border: (!isCustomTip && tipPercentage === pct) ? '1px solid #d4af37' : '1px solid #222', borderRadius: '6px', padding: '8px 0', cursor: 'pointer' }}>
                                            <span style={{ display: 'block', color: (!isCustomTip && tipPercentage === pct) ? '#d4af37' : '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>{pct}%</span>
                                        </button>
                                    ))}
                                    {isCustomTip ? (
                                        <input 
                                            type="number" 
                                            placeholder="%" 
                                            value={customTipValue} 
                                            onChange={(e) => setCustomTipValue(e.target.value)}
                                            style={{ background: '#111', border: '1px solid #d4af37', borderRadius: '6px', color: '#fff', textAlign: 'center', fontSize: '0.85rem' }} 
                                        />
                                    ) : (
                                        <button onClick={() => setIsCustomTip(true)} style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '0.75rem' }}>Otro ✏️</button>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#111', padding: '15px', borderRadius: '8px' }}>
                                <span style={{ fontSize: '1rem' }}>Total a pagar</span>
                                <span style={{ color: '#d4af37', fontSize: '1.6rem', fontWeight: 'bold' }}>Q{totalAPagar.toFixed(2)}</span>
                            </div>

                            <button className="btn-gold" style={{ width: '100%', background: '#d4af37', color: '#000', border: 'none', padding: '14px 0', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                                Confirmar y pagar
                            </button>

                            <button 
                                onClick={() => setShowCancelModal(true)} 
                                style={{ width: '100%', background: 'none', border: '1px solid #f44336', color: '#f44336', padding: '10px 0', fontSize: '0.9rem', fontWeight: '500', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={(e) => { e.target.style.background = '#f44336'; e.target.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = '#f44336'; }}
                            >
                                Cancelar Pedido
                            </button>
                        </aside>
                    </div>
                )}
            </main>

            {/* MODAL DE CANCELACIÓN CON VALIDACIÓN */}
            {showCancelModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#0f0f0f', border: '1px solid #222', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ color: '#f44336', fontSize: '1.4rem', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>¿Deseas cancelar tu orden?</h3>
                        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.4' }}>
                            Por políticas del restaurante, es obligatorio que ingreses un motivo válido de **al menos 5 palabras** para notificar a la cocina de Áurea.
                        </p>
                        
                        <textarea 
                            value={cancelReason}
                            onChange={(e) => {
                                setCancelReason(e.target.value);
                                if(reasonError) setReasonError("");
                            }}
                            placeholder="Escribe aquí tu motivo de cancelación..."
                            style={{ width: '94%', height: '80px', background: '#161616', border: '1px solid #333', borderRadius: '6px', color: '#fff', padding: '12px', resize: 'none', fontSize: '0.9rem', marginBottom: '10px' }}
                        />

                        {reasonError && <p style={{ color: '#f44336', fontSize: '0.8rem', marginBottom: '15px' }}>⚠️ {reasonError}</p>}

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button 
                                onClick={() => { setShowCancelModal(false); setCancelReason(""); setReasonError(""); }} 
                                style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Regresar
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                style={{ background: '#f44336', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Confirmar Cancelación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WHATSAPP FLOTANTE */}
            <a href="https://wa.me/50255551234" className="whatsapp-floating-trigger" target="_blank" rel="noreferrer"
                style={{
                    position: "fixed", bottom: "30px", right: "30px",
                    background: "#25d366", color: "white",
                    width: "60px", height: "60px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "30px", zIndex: "1000",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}>
                <i className="ri-whatsapp-line"></i>
            </a>
        </div>
    );
};