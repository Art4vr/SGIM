import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlatillos, eliminarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import { useNavigate } from 'react-router-dom';
import NuevoPlatillo from './nuevoPlatillo';
import api from '../../api/axiosConfig';
import styles from '../../styles/platillos/Platillo.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import IngredientesPlatillo from './ingredientes';
import PerfilUsuario from '../../components/PerfilUsuario';

const VistaPlatillos = () => {
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const { logout, user, loading } = useAuth();
    const navigate = useNavigate();
    const [platillos, setPlatillos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [platilloEditando, setPlatilloEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [modalAccion, setModalAccion] = useState(null);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const cargarPlatillos = async () => {
        
        setCargando(true);
        try {
            const res = await getPlatillos();
            setPlatillos(res.data);
        } catch (err) {
            setMensaje('Error al cargar platillos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarPlatillos();
    }, []);

    const abrirModal = (platillo = null, modalAccion = null) => {
        setPlatilloEditando(platillo);
        setModalVisible(true);
        setMensaje('');
        setModalAccion(modalAccion);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setPlatilloEditando(null);
    };

    const eliminar = async (id) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar este platillo?");
        if (!confirm) return;

        setEliminandoId(id);
        try {
            await eliminarPlatillo(id);
            setMensaje('Platillo eliminado correctamente');
            await cargarPlatillos();
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || err.message || 'Error al eliminar platillo');
        } finally {
            setEliminandoId(null);
        }
    };

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
        };

    const handleLogout = async () => {
        try {
            await logout(); // Esto hace POST /logout, limpia user y localStorage
            navigate('/'); // Redirige al login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
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

    const [filtros, setFiltros] = useState({
        categoria: '',
        estado: '',
        precioMin: '',
        precioMax: ''
    });

    const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    const platillosFiltrados = platillos.filter((p) => {
        const coincideCategoria = filtros.categoria === '' || p.categoria === filtros.categoria;
        const coincideEstado = filtros.estado === '' || p.estado === filtros.estado;

        // Lógica para el rango de precios
        const precioPlatillo = parseFloat(p.precio);
        const min = parseFloat(filtros.precioMin);
        const max = parseFloat(filtros.precioMax);

        // Si 'min' no es un número (isNaN) o el precio es mayor/igual, coincide
        const coincideMin = isNaN(min) || precioPlatillo >= min;
        // Si 'max' no es un número (isNaN) o el precio es menor/igual, coincide
        const coincideMax = isNaN(max) || precioPlatillo <= max;

        return coincideCategoria && coincideEstado && coincideMin && coincideMax;
    });

    const limpiarFiltros = () => {
        setFiltros ({
            categoria: '',
            estado: '',
            precioMin: '',
            precioMax: ''
        });
    };

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                {/* ESTA ES LA PARTE CLAVE (Derecha) */}
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" /> {}
                </div>
            </div>
        
            {/* Menú lateral Dinámico */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    {/* === OPCIONES PARA GERENTE (ROL 1) === */}
                    {user?.rol === 1 && (
                        <>
                            <li onClick={() => navigate('/usuarios')}>Usuarios</li>
                            <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                            <li onClick={() => navigate('/inventario')}>Inventario</li>
                            <li onClick={() => navigate('/platillos')}>Platillos</li>
                            <li onClick={() => navigate('/reportes')}>Reportes</li>
                            <li onClick={() => navigate('/mesas')}>Mesas</li>
                            <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                        </>
                    )}

                    {/* === OPCIONES PARA MESERO (ROL 4) === */}
                    {user?.rol === 4 && (
                        <>
                            <li onClick={() => navigate('/OrdenesMesero')}>Órdenes Mesero</li>
                            <li onClick={() => navigate('/platillos')}>Platillos</li>
                            <li onClick={() => navigate('/VerMenu')}>Ver Menú</li>
                            <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                        </>
                    )}
                </ul>
            </div>
            {/* Contenido Principal */}
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>GESTIÓN DE PLATILLOS</h1>

                        <h2 className={styles.subtitle}>Añadir Platillo al Menú</h2>
                        <button className={stylesCommon.registerBtn} onClick={() => abrirModal()}>
                            Agregar Platillo
                        </button>

                        {mensaje && <p className={styles.message}>{mensaje}</p>}
                        <h2 className={styles.subtitle}>Búsqueda de Elementos</h2>

                        {/* === FILTROS === */}
                        <div className={stylesCommon.filterContainer}>
                            {/* Este 'select' de categoría se queda como está */}
                            <select
                                value={filtros.categoria}
                                onChange={(e) => handleFiltroChange(e, 'categoria')}
                                className={stylesCommon.filterInput}
                            >
                                <option value="">Todas las categorías</option>
                                {[...new Set(platillos.map((p) => p.categoria))].map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Este 'select' de estado se queda como está */}
                            <select
                                value={filtros.estado}
                                onChange={(e) => handleFiltroChange(e, 'estado')}
                                className={stylesCommon.filterInput}
                            >
                                <option value="">Todos los estados</option>
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="descontinuado">Descontinuado</option>
                            </select>

                            {/* --- NUEVOS INPUTS DE PRECIO --- */}
                            <input
                                type="number"
                                placeholder="Precio Mín."
                                value={filtros.precioMin}
                                onChange={(e) => handleFiltroChange(e, 'precioMin')}
                                className={stylesCommon.filterInput}
                                min="0"
                            />
                            <input
                                type="number"
                                placeholder="Precio Máx."
                                value={filtros.precioMax}
                                onChange={(e) => handleFiltroChange(e, 'precioMax')}
                                className={stylesCommon.filterInput}
                                min="0"
                            />
                        </div>
                        {/*Botón para limpiar filtros*/}
                        <button onClick={limpiarFiltros} className={stylesCommon.registerBtn}>Limpiar Filtros</button>
                        {cargando ? (
                            <p className={styles.loadingText}>🔄 Cargando platillos...</p>
                        ) : (
                            <div className={stylesCommon.tableWrapper}>
                                <table className={styles.platilloTable}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripcion</th>
                                            <th>Categoria</th>
                                            <th>Imagen</th>
                                            <th>Precio</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                            <th>Ingredientes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platillosFiltrados.map((p) => (
                                            <tr key={p.idPlatillo}>
                                                <td>{p.nombre}</td>
                                                <td>{p.descripcion}</td>
                                                <td>{p.categoria}</td>
                                                <td>{p.imagen}</td>
                                                <td>{p.precio}</td>
                                                <td>{p.estado}</td>
                                                <td className={styles.acciones}>
                                                    <button onClick={() => abrirModal(p,"nuevoPlatillo")}>✏️</button>
                                                    <button
                                                        onClick={() => eliminar(p.idPlatillo)}
                                                        disabled={eliminandoId === p.idPlatillo}
                                                    >
                                                        {eliminandoId === p.idPlatillo ? '🗑️...' : '🗑️'}
                                                    </button>
                                                </td>
                                                <td className={styles.acciones}> 
                                                    <button onClick={() => abrirModal(p,"ingredientes")}>🍽️</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}


                        {modalVisible && (
                            modalAccion === 'nuevoPlatillo' ? (
                            <NuevoPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
                        ) : (
                            <IngredientesPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
                        )
                        )}

                        <button
                            className={`${stylesCommon.registerBtn} ${stylesCommon.backBtn}`}
                            type="button"
                            onClick={() => navigate('/PanelGerente')}
                            >
                            VOLVER AL INICIO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaPlatillos;
