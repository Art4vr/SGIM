import React, { useState, useEffect } from 'react';
import styles from '../../styles/auth/perfilUsuario.module.css'; 
import stylesCommon from '../../styles/common/common.module.css';
import { format } from 'date-fns'; // Si estás formateando fechas
import { LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const AlertasInventario = ({ listaInventario }) => {
    //Alertas
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [expiringAlerts, setExpiringAlerts] = useState([]);
    const [showLowStockAlert, setShowLowStockAlert] = useState(true);
    const [showExpiringAlert, setShowExpiringAlert] = useState(true);
    const [perfilAbierto, setPerfilAbierto] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!listaInventario || listaInventario.length === 0) {
            setLowStockAlerts([]);
            setExpiringAlerts([]);
            setShowLowStockAlert(false);
            setShowExpiringAlert(false);
            return;
        }

        const low = listaInventario.filter(item =>
            item.cantidadActual != null &&
            item.cantidadMinima != null &&
            Number(item.cantidadActual) <= Number(item.cantidadMinima)
        );

        const hoy = new Date();
        const expiringThresholdDays = 2; // ajusta el umbral aquí
        const exp = listaInventario.filter(item => {
            if (!item.fechaCaducidad) return false;
            const fechaCad = new Date(item.fechaCaducidad);
            const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));
            return diffDays <= expiringThresholdDays;
        });

        setLowStockAlerts(low);
        setExpiringAlerts(exp);
        setShowLowStockAlert(low.length > 0);
        setShowExpiringAlert(exp.length > 0);
    }, [listaInventario]);

    return (
        <div className={styles.perfilContainer}>
            
            {/* Botón de alerta */}
            <button 
                className={styles.logoalerta} 
                onClick={() => setPerfilAbierto(!perfilAbierto)}
            >
                <LuTriangleAlert />
            </button>

            {/* Menú lateral de alertas */}
            {perfilAbierto && (
                <div style={{
                    position: 'fixed',
                    bottom: '0',
                    left: '0',
                    width: '300px',
                    maxWidth: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(193, 191, 191, 0.85)', // Cambié a un fondo semitransparente
                    backdropFilter: 'blur(5px)',  // Aplica el desenfoque
                    zIndex: 999,
                    boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
                    padding: '20px',
                    overflowY: 'auto',
                    transform: perfilAbierto ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease-out',
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <strong>Alertas</strong>
                    </div>

                    {/* Alertas de bajo stock */}
                    {showLowStockAlert && lowStockAlerts.length > 0 && (
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos con bajo stock ({lowStockAlerts.length}):</strong>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '10px',
                            }}>
                                {lowStockAlerts.map(item => (
                                    <div key={item.idInventarioProducto} style={{
                                        backgroundColor: '#ffcccc',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        boxSizing: 'border-box',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    }}>
                                        <p style={{ margin: '0', fontWeight: 'bold' }}>{item.nombreProducto}</p>
                                        <p style={{ margin: '5px 0' }}>Cantidad actual: {item.cantidadActual}</p>
                                        <p style={{ margin: '0' }}>Mínima: {item.cantidadMinima}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowLowStockAlert(false)} style={{
                                marginTop: '12px',
                                backgroundColor: '#ff5555',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Cerrar
                            </button>
                        </div>
                    )}

                    {/* Alertas de productos cerca de caducar */}
                    {showExpiringAlert && expiringAlerts.length > 0 && (
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos cerca de caducidad ({expiringAlerts.length}):</strong>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                marginTop: '10px',
                            }}>
                                {expiringAlerts.map(item => (
                                    <div key={item.idInventarioProducto} style={{
                                        backgroundColor: '#ffffcc',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        boxSizing: 'border-box',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    }}>
                                        <p style={{ margin: '0', fontWeight: 'bold' }}>{item.nombreProducto}</p>
                                        <p style={{ margin: '5px 0' }}>Caduca el: {item.fechaCaducidad ? format(new Date(item.fechaCaducidad), 'dd/MM/yyyy') : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setShowExpiringAlert(false)} style={{
                                marginTop: '12px',
                                backgroundColor: '#ff5555',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Cerrar
                            </button>
                        </div>
                    )}
                    <button title='Pedir a proveedores' onClick={() => navigate('/Proveedores')} style={{
                                marginTop: '12px',
                                backgroundColor: '#c612c3d4',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Realizar Pedido
                            </button>
                </div>
            )}
        </div>
    );
};

export default AlertasInventario;
