import React, { useState, useEffect, useRef } from 'react';
import { getPlatillos, eliminarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import { useNavigate } from 'react-router-dom';
import NuevoPlatillo from './nuevoPlatillo';
import api from '../../api/axiosConfig';
import styles from '../../styles/platillos/Platillo.module.css';
import stylesCommon from '../../styles/common/common.module.css';

const VistaPlatillos = () => {
    const navigate = useNavigate();
    const [platillos, setPlatillos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [platilloEditando, setPlatilloEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
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

    const abrirModal = (platillo = null) => {
        setPlatilloEditando(platillo);
        setModalVisible(true);
        setMensaje('');
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
            setMensaje('Error al eliminar platillo');
        } finally {
            setEliminandoId(null);
        }
    };

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
        };

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
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
        nombre: '',
        categoria: '',
        estado: ''
    });

    const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    const platillosFiltrados = platillos.filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
        const coincideCategoria = filtros.categoria === '' || p.categoria === filtros.categoria;
        const coincideEstado = filtros.estado === '' || p.estado === filtros.estado;
        return coincideNombre && coincideCategoria && coincideEstado;
    });



    return (
        <div className={styles.container}>
        {/* Encabezado */}
                    <div className={stylesCommon.header}>
                        <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                            <img src="/imagenes/menu_btn.png" alt="Menú" />
                        </button>
                        <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                        <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
                    </div>
        
                    {/* Menú lateral */}
                    <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                        <ul>
                            <li onClick={() => navigate('/Perfil')}>Perfil</li>
                            <li onClick={() => navigate('/Platillos')}>Platillos</li>
                            <li onClick={() => navigate('/Proveedores')}>Proveedores</li>
                            <li onClick={() => navigate('/Productos')}>Productos</li>
                            <li onClick={() => navigate('/Imprevistos')}>Ver Imprevistos</li>
                            <li onClick={() => navigate('/NuevoUsuario')}>Nuevo Usuario</li>
                            <li onClick={handleLogout}>Log Out</li>
                        </ul>
                    </div>
            {/* Contenido Principal */}
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>Gestión de Platillos</h1>

                        <button className={stylesCommon.registerBtn} onClick={() => abrirModal()}>
                            Agregar Platillo
                        </button>

                        {mensaje && <p className={styles.message}>{mensaje}</p>}

                        {/* === FILTROS === */}
                        <div className={stylesCommon.filterContainer}>
                            <input
                                type="text"
                                placeholder="Filtrar por nombre"
                                value={filtros.nombre}
                                onChange={(e) => handleFiltroChange(e, 'nombre')}
                                className={stylesCommon.filterInput}
                            />

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
                        </div>
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
                                                    <button onClick={() => abrirModal(p)}>✏️</button>
                                                    <button
                                                        onClick={() => eliminar(p.idPlatillo)}
                                                        disabled={eliminandoId === p.idPlatillo}
                                                    >
                                                        {eliminandoId === p.idPlatillo ? '🗑️...' : '🗑️'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {modalVisible && (
                            <NuevoPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
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
