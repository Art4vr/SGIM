import React, { useState, useEffect, useRef } from 'react';
import { getProductos, eliminarProducto } from '../../api/productoApi';
import NuevoProducto from './nuevoProducto';
import styles from '../../styles/productos/producto.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const VistaProductos = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const cargarProductos = async () => {
        setCargando(true);
        try {
            const res = await getProductos();
            setProductos(res.data);
        } catch (err) {
            console.error(err);
            setMensaje('Error al cargar productos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const abrirModal = (producto = null) => {
        setProductoEditando(producto);
        setModalVisible(true);
        setMensaje('');
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setProductoEditando(null);
    };

    const eliminar = async (id) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirm) return;

        setEliminandoId(id);
        try {
            await eliminarProducto(id);
            setMensaje('Producto eliminado correctamente');
            await cargarProductos();
        } catch (err) {
            console.error(err);
            setMensaje('Error al eliminar producto');
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

    // Justo antes del return, debajo de tus otros useState
        const [filtros, setFiltros] = useState({
        nombre: '',
        categoria: '',
        unidad: '',
        estado: ''
        });

        const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
        };

        // Obtener listas únicas para los selects
        const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
        const unidadesUnicas = [...new Set(productos.map(p => p.unidad))];
        const estadosUnicos = [...new Set(productos.map(p => p.estado))];

        // Filtrado
        const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
        (filtros.categoria === '' || p.categoria === filtros.categoria) &&
        (filtros.unidad === '' || p.unidad === filtros.unidad) &&
        (filtros.estado === '' || p.estado === filtros.estado)
        );


    return (
        <div className={styles.container}>
                    {/* Encabezado */}
                    <div className={stylesCommon.header}>
                        <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                            <img src="/imagenes/menu_btn.png" alt="Menú" />
                        </button>
                        <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi</h1>
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
            {/*Contenido principal*/}
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>Gestión de Productos</h1>

                        <button className={stylesCommon.registerBtn} onClick={() => abrirModal()}>
                            Agregar Producto
                        </button>

                        {mensaje && <p className={stylesCommon.message}>{mensaje}</p>}

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
                            className={stylesCommon.filterSelect}
                        >
                            <option value="">Todas las categorías</option>
                            {categoriasUnicas.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filtros.unidad}
                            onChange={(e) => handleFiltroChange(e, 'unidad')}
                            className={stylesCommon.filterSelect}
                        >
                            <option value="">Todas las unidades</option>
                            {unidadesUnicas.map((uni, idx) => (
                            <option key={idx} value={uni}>{uni}</option>
                            ))}
                        </select>

                        <select
                            value={filtros.estado}
                            onChange={(e) => handleFiltroChange(e, 'estado')}
                            className={stylesCommon.filterSelect}
                        >
                            <option value="">Todos los estados</option>
                            {estadosUnicos.map((est, idx) => (
                            <option key={idx} value={est}>{est}</option>
                            ))}
                        </select>
                        </div>


                        {cargando ? (
                            <p className={styles.loadingText}>🔄 Cargando productos...</p>
                        ) : (
                            <div className={stylesCommon.tableWrapper}>
                                <table className={styles.productTable}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Categoría</th>
                                            <th>Unidad</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productosFiltrados.map((p) => (
                                            <tr key={p.idProducto}>
                                                <td>{p.nombre}</td>
                                                <td>{p.categoria}</td>
                                                <td>{p.unidad}</td>
                                                <td>{p.estado}</td>
                                                <td className={styles.acciones}>
                                                    <button onClick={() => abrirModal(p)}>✏️</button>
                                                    <button
                                                        onClick={() => eliminar(p.idProducto)}
                                                        disabled={eliminandoId === p.idProducto}
                                                    >
                                                        {eliminandoId === p.idProducto ? '🗑️...' : '🗑️'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button
                            className={`${stylesCommon.registerBtn} ${stylesCommon.backBtn}`}
                            type="button"
                            onClick={() => navigate('/PanelGerente')}
                            >
                            VOLVER AL INICIO
                        </button>
                        {modalVisible && (
                            <NuevoProducto
                                producto={productoEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarProductos}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaProductos;
