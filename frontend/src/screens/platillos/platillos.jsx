import React, { useState, useEffect } from 'react';
import { getPlatillos, eliminarPlatillo} from '../../api/platilloApi';
import {  getCategorias } from '../../api/productoApi';
import NuevoPlatillo from './nuevoPlatillo';
import styles from './../../styles/platillos/Platillo.module.css'
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const VistaPlatillos = () => {
    const [platillos, setPlatillos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [platilloEditando, setPlatilloEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);

    const cargarPlatillos = async () => {
        setCargando(true);
        try {
            const [res, cat] = await Promise.all([getPlatillos(),getCategorias()]);
            setPlatillos(res.data);
            setCategorias(cat.data);
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

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={styles.header}>
                    <button className={styles.menuBoton} onClick={toggleMenu}>
                        <img src="/imagenes/menu_btn.png" alt="Menú" />
                    </button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>
            
            {/* Menú lateral */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>
            
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>Gestión de Platillos</h1>

                        <button className={styles.registerBtn} onClick={() => abrirModal()}>
                            Agregar Platillo
                        </button>

                        {mensaje && <p className={styles.message}>{mensaje}</p>}

                        {cargando ? (
                            <p className={styles.loadingText}>Cargando platillos...</p>
                        ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.platilloTable}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripción</th>
                                            <th>Precio</th>
                                            <th>Categoria</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                {platillos.map((p) => (
                                    <tr key={p.idPlatillo}>
                                        <td>{p.nombre}</td>
                                        <td>{p.descripcion}</td>
                                        <td>{p.precio}</td>
                                        <td>{p.categorias}</td>
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

                        <button
                            className={`${styles.registerBtn} ${styles.backBtn}`}
                            type="button"
                                onClick={() => navigate('/PanelGerente')}
                            >
                                VOLVER AL INICIO
                        </button>

                        {modalVisible && (
                            <NuevoPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaPlatillos;
