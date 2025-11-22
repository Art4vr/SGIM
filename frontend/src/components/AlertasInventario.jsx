import React, { useState, useEffect, useRef } from 'react';
import stylesCommon from '../styles/common/common.module.css'; 
import styles from '../styles/auth/perfilUsuario.module.css';
import { format } from 'date-fns';
import { LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

// Importaciones de API necesarias (Asegúrate de que las rutas sean correctas)
import api from '../api/axiosConfig';
import { getProductos, getUnidades, getCategorias } from '../api/productoApi';
import { getProveedores } from '../api/proveedorApi';

const AlertasInventario = () => { // Ya no recibe props
    // --- ESTADOS DE DATOS ---
    const [inventarios, setInventarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [listaInventario, setListaInventario] = useState([]);

    // --- ESTADOS DE ALERTAS ---
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [expiringAlerts, setExpiringAlerts] = useState([]);
    const [showLowStockAlert, setShowLowStockAlert] = useState(true);
    const [showExpiringAlert, setShowExpiringAlert] = useState(true);
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const menuRef = useRef(null); // Referencia para el menú desplegable
    const btnRef = useRef(null);  // Referencia para el botón de alerta

    const navigate = useNavigate();

    // 1. CARGAR DATOS DE LA API (Al montar el componente)
    useEffect(() => {
        const cargarDatosInternos = async () => {
            try {
                // Ejecutamos todas las promesas en paralelo
                const [productosRes, inventariosRes, medidasRes, proveedoresRes, usuariosRes] = await Promise.all([
                    getProductos(),
                    api.get('/api/inventario'),
                    getUnidades(),
                    getProveedores(),
                    api.get('/api/usuarios')
                ]);

                setProductos(productosRes.data || []);
                setInventarios(inventariosRes.data.resultados || []);
                setMedidas(medidasRes.data || []);
                setProveedores(proveedoresRes.data || []);
                setUsuarios(usuariosRes.data || []);
            } catch (err) {
                console.error("Error cargando datos para alertas:", err);
            }
        };
        cargarDatosInternos();
    }, []);

    // 2. MAPEAR Y PROCESAR LA LISTA (Igual que tenías en VistaInventario)
    useEffect(() => {
        if (inventarios.length > 0 && productos.length > 0) {
            const lista = inventarios.map((inventario) => {
                // Nota: evaluarEstado hace updates a la BD. Ten cuidado si este componente se monta muchas veces.
                evaluarEstado(inventario); 

                const producto = productos.find((p) => p.idProducto === inventario.Producto_idProducto);
                
                return {
                    ...inventario,
                    nombreProducto: producto ? producto.nombre : 'Desconocido',
                    // No necesitamos mapear todo (proveedor, usuario) si solo es para alertas,
                    // pero lo dejo por si quieres mostrar más info.
                };
            });
            setListaInventario(lista);
        }
    }, [inventarios, productos, medidas, proveedores, usuarios]);

    // 3. LÓGICA DE FILTRADO DE ALERTAS
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
        const expiringThresholdDays = 2;
        const exp = listaInventario.filter(item => {
            if (!item.fechaCaducidad) return false;
            const fechaCad = new Date(item.fechaCaducidad);
            const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));
            return diffDays <= expiringThresholdDays;
        });

        setLowStockAlerts(low);
        setExpiringAlerts(exp);
        // Solo mostramos si hay alertas (o puedes mantener el estado true inicial)
        if(low.length > 0) setShowLowStockAlert(true);
        if(exp.length > 0) setShowExpiringAlert(true);

    }, [listaInventario]);


    useEffect(() => { 
        const handleClickOutside = (event) => {
            if(perfilAbierto){
                if(
                    perfilAbierto &&
                    menuRef.current &&
                    !menuRef.current.contains(event.target) &&
                    btnRef.current &&
                    !btnRef.current.contains(event.target)
                    ) {
                        setPerfilAbierto(false);
                    }
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
    }, [perfilAbierto]);

    // Función auxiliar traída de VistaInventario
    const evaluarEstado = async (item) => {
        // Tu lógica de actualización de estado (PUT)
        // PRECAUCIÓN: Esto hará peticiones al backend cada vez que se cargue la alerta.
        // Lo ideal es que esto lo haga el backend automáticamente, pero aquí se mantiene tu lógica.
        const hoy = new Date();
        if (Number(item.cantidadActual) === 0) {
            await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'finalizado' });
        } else if (item.fechaCaducidad) {
            const fechaCad = new Date(item.fechaCaducidad);
            if (hoy >= fechaCad) {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'caducado' });
            } else {
                const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));   
                if (diffDays <= 2) {
                    await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'pronto_a_caducar' });
                }
            }
        } else if (item.cantidadActual != null && item.cantidadMinima != null) {
            if (Number(item.cantidadActual) <= Number(item.cantidadMinima)) {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'bajo_stock' });
            } else {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'en_stock' });
            }
        }
    };

    return (
        <>
            <button ref={btnRef}
                className={stylesCommon.logoalerta} 
                onClick={() => setPerfilAbierto(!perfilAbierto)}
            >
                <LuTriangleAlert />
            </button>
            
                <div ref= {menuRef} 
                className={`${stylesCommon.alertaMenu} ${perfilAbierto ? stylesCommon.alertaMenuAbierto : ''}`}
                //style={{position: 'fixed',
                    //bottom: '0',
                    //left: '0',
                    //width: '300px',
                    //maxWidth: '100%',
                    //height: '100%',
                    //backgroundColor: 'rgba(193, 191, 191, 0.85)', // Cambié a un fondo semitransparente
                    //backdropFilter: 'blur(5px)',  // Aplica el desenfoque
                    //zIndex: 999,
                    //boxShadow: '2px 0 10px rgba(0,0,0,0.2)',
                    //padding: '20px',
                    //overflowY: 'auto',
                    //transform: perfilAbierto ? 'translateX(0)' : 'translateX(-100%)',
                    //transition: 'transform 0.3s ease-out' }}
                    >
                    {/* Lógica de renderizado de lowStockAlerts y expiringAlerts */}
                    <div style={{ marginBottom: '20px' }}>
                        <strong>Alertas</strong>
                    </div>
                    
                    {/* Alerta Bajo Stock */}
                    {showLowStockAlert && lowStockAlerts.length > 0 && (
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos con bajo stock ({lowStockAlerts.length}):</strong>
                            {/* ... tu map de lowStockAlerts ... */}
                            {lowStockAlerts.map(item => (
                                    <div key={item.idInventarioProducto} style={{ backgroundColor: '#d92579', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                                        <p style={{ margin: '0', fontWeight: 'bold' }}>{item.nombreProducto}</p>
                                        <p style={{ margin: '5px 0' }}>Cantidad actual: {parseInt(item.cantidadActual)}</p>
                                        <p style={{ margin: '0' }}>Mínima: {item.cantidadMinima}</p>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Alerta Caducidad */}
                    {showExpiringAlert && expiringAlerts.length > 0 && (
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos cerca de caducidad ({expiringAlerts.length}):</strong>
                            {/* ... tu map de expiringAlerts ... */}
                            {expiringAlerts.map(item => (
                                <div key={item.idInventarioProducto} style={{ backgroundColor: '#d92579', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
                                    <p style={{ margin: '0', fontWeight: 'bold' }}>{item.nombreProducto}</p>
                                    <p style={{ margin: '5px 0' }}>Caduca: {item.fechaCaducidad ? format(new Date(item.fechaCaducidad), 'dd/MM/yyyy') : 'N/A'}</p>
                                </div>
                            ))}

                        {/* Mensaje si no hay alertas */}
                        {!showLowStockAlert && !showExpiringAlert && (
                            <p style={{textAlign:'center', color:'#aaa'}}>No hay alertas activas.</p>
                        )}
                    </div>
                    )}
                </div>
        </>
    );
};

export default AlertasInventario;