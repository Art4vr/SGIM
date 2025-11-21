//pantalla para actualizar cantidad de productos
//Añade manualmente la cantidad de producto que llegó, registra los datos que se especifican en el modelo y controlador de registrarInventario
//Escoge el producto de una lista de productos y a partir de ahi agrega los datos como la cantidad
//Escoge tambien de la lista de unidades de medida y de una de proveedores
//Ingresa fecha de caducidad, cantidad maxima y minima necesarias, asi como cantidad actual
//Jala el username del usuario que hace el registro

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from '../../styles/inventario/actualizarStock.module.css';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';

import { getProductos, getUnidades, getCategorias } from '../../api/productoApi';
import { getProveedores } from '../../api/proveedorApi';
import PerfilUsuario from '../../components/PerfilUsuario';

const ActualizarStock = () => {
    const { logout, loading, user } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [productos, setProductos] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [idProductoSeleccionado, setIdProductoSeleccionado] = useState('');
    const [cantidadAgregar, setCantidadAgregar] = useState(0);
    const [inventarioActual, setInventarioActual] = useState(null);
    const [cantidadMaxima, setCantidadMaxima] = useState(0);
    const [cantidadMinima, setCantidadMinima] = useState(0);
    const [fechaCaducidad, setFechaCaducidad] = useState('');
    const [idProveedorSeleccionado, setIdProveedorSeleccionado] = useState('');
    const [idUnidadMedidaSeleccionada, setIdUnidadMedidaSeleccionada] = useState('');
    const menuRef = useRef(null);
    const botonRef = useRef(null);
    const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

    //Notificaciones personalizadas
    const mostrarNotificacion = (mensaje, tipo = 'success') => {
        setNotificacion({ visible: true, mensaje, tipo });
        // Ocultar después de 1.5 segundos
        setTimeout(() => {
            setNotificacion({ visible: false, mensaje: '', tipo: 'info' });
        }, 3000);
    };

    const cargarDatos = async () => {

        setCargando(true);
        try {
            const productosData = await getProductos();
            const unidadesData = await getUnidades();
            const categoriasData = await getCategorias();
            const proveedoresData = await getProveedores();
            
            //console.log("productos : " +  productosData.data);
            setProductos(productosData.data);
            //console.log("Unidades de medida: ",  unidadesData.data);
            setUnidades(unidadesData.data);
            //console.log("categorias: " +  categoriasData.data);
            setCategorias(categoriasData.data);
            //console.log("proveedores: " +  proveedoresData.data);
            setProveedores(proveedoresData.data);
        } catch (error) {
            mostrarNotificacion('Error al cargar los datos iniciales', 'error');
            //setMensaje('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const manejarActualizarStock = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');
        console.log("Unidades de medida2: ",  unidades);
        try {
            console.log("DATOS PARA QUERY: idProducto", idProductoSeleccionado, " cantidadActual: ", cantidadAgregar, " cantidadMaxima: ", cantidadMaxima, " cantidadMinima: ", cantidadMinima, " fechaCaducidad: ", fechaCaducidad, " idProveedor: ", idProveedorSeleccionado, "idUsuario", user.id, " idUnidadMedida: ", idUnidadMedidaSeleccionada);
            const response = await api.post('/api/inventario/crear', {
                Producto_idProducto: idProductoSeleccionado,
                cantidadMaxima,
                cantidadMinima,
                cantidadActual: cantidadAgregar,
                fechaCaducidad,
                Proveedor_idProveedor: idProveedorSeleccionado,
                Usuario_idUsuario: user.id,
                UnidadMedida_idUnidadMedida: idUnidadMedidaSeleccionada
            });
            mostrarNotificacion('Stock actualizado correctamente', 'success');
            //setMensaje('Stock actualizado correctamente');
        } catch (error) {
            //setMensaje(error.response?.data?.mensaje || error.message || 'Error al actualizar el stock');
            const errorMsg = error.response?.data?.mensaje || error.message || 'Error al actualizar el stock';
            mostrarNotificacion(errorMsg, 'error');
        } finally {
            setCargando(false);
        }
    };
    
    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    useEffect(() => { 
        const handleClickOutside = (event) =>{
            if(
                menuAbierto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                botonRef.current &&
                !botonRef.current.contains(event.target)
            ){
                setMenuAbierto(false);
            }
        }

        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    }, [menuAbierto]);

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button ref={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                {/* Menú de usuario */}
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
                </div>
            </div>

            {/* 4. Renderizado de la notificación flotante */}
            {notificacion.visible && (
                <div className={`${styles.notificacion} ${notificacion.tipo === 'success' ? styles.success : styles.error}`}>
                    {notificacion.mensaje}
                </div>
            )}

            {/* Menú lateral */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/usuarios')}>Usuarios</li>
                    <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                    <li onClick={() => navigate('/inventario')}>Inventario</li>
                    <li onClick={() => navigate('/platillos')}>Platillos</li>
                    <li onClick={() => navigate('/pedidos')}>Pedidos</li>
                    <li onClick={() => navigate('/reportes')}>Reportes</li>
                    <li onClick={() => navigate('/mesas')}>Mesas</li>
                    <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                </ul>
            </div>

            {/* Contenido Principal Centrado */}
            <div className={styles.bodyContainer}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Actualizar Stock</h2>
                    
                    {/* Ya no renderizamos el div.mensaje antiguo aquí */}

                    {cargando && !productos.length ? (
                         <div className={styles.spinnerContainer}>
                            {/* Loader simple CSS */}
                            <div className={styles.simpleLoader}>Cargando...</div>
                         </div>
                    ) : (
                        <form onSubmit={manejarActualizarStock} className={styles.form}>
                            {/* Producto */}
                            <div className={styles.formGroup}>
                                <label>Producto:</label>
                                <select value={idProductoSeleccionado} onChange={(e) => setIdProductoSeleccionado(e.target.value)} required>
                                    <option value="">Seleccione un producto</option>
                                    {productos.map((producto) => ( 
                                        <option key={producto.idProducto} value={producto.idProducto}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Cantidad y Unidad */}
                            <div className={styles.formGroup}>
                                <label>Cantidad a Agregar:</label>
                                <input type="number" value={cantidadAgregar} onChange={(e) => setCantidadAgregar(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Unidad de Medida:</label>
                                <select value={idUnidadMedidaSeleccionada} onChange={(e) => setIdUnidadMedidaSeleccionada(e.target.value)} required>
                                    <option value="">Seleccione unidad</option>
                                    {unidades.map((unidad) => (
                                        <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                                            {unidad.abreviatura}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Máximos y Mínimos */}
                            <div className={styles.formGroup}>
                                <label>Cantidad Máxima:</label>
                                <input type="number" value={cantidadMaxima} onChange={(e) => setCantidadMaxima(e.target.value)} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Cantidad Mínima:</label>
                                <input type="number" value={cantidadMinima} onChange={(e) => setCantidadMinima(e.target.value)} required />
                            </div>

                            {/* Fecha y Proveedor */}
                            <div className={styles.formGroup}>
                                <label>Fecha de Caducidad:</label>
                                <input type="date" value={fechaCaducidad} onChange={(e) => setFechaCaducidad(e.target.value)} required />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Proveedor:</label>
                                <select value={idProveedorSeleccionado} onChange={(e) => setIdProveedorSeleccionado(e.target.value)} required>
                                    <option value="">Seleccione un proveedor</option>
                                    {proveedores.map((proveedor) => (
                                        <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botón de Acción */}
                            <button type="submit" className={styles.submitBtn} disabled={cargando}>
                                {cargando ? 'Guardando...' : 'Actualizar Stock'}
                            </button>
                        </form>
                    )}
                    <div>
                        {/*Botón para volver al inventario*/}
                        <button className={stylesCommon.backBtn} onClick={() => navigate('/inventario')}>
                            VOLVER ATRÁS
                        </button>

                        {/*Botón de volver al panel*/}
                        <button className={stylesCommon.registerBtn} onClick={() => navigate('/PanelGerente')}>
                            VOLVER AL INICIO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActualizarStock;