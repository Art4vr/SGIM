import React, { useState, useEffect, useRef } from 'react';
import NuevoProveedor from './agregarProveedor';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/proveedores/proveedor.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';
// Funciones API
import { getProveedores,eliminarProveedor } from '../../api/proveedorApi';
import Encabezado from '../../components/Encabezado';
import AlertasInventario from '../../components/AlertasInventario';

const VistaProveedores = () => {
    const { logout, user, loading } = useAuth();
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [proveedorEditando, setProveedorEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);

    const cargarProveedores = async () => {
        setCargando(true);
        try {
            const res = await getProveedores();
            setProveedores(res.data);
        } catch (err) {
            setMensaje('Error al cargar proveedores');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, []);

    const abrirModal = (proveedor = null) => {
        setProveedorEditando(proveedor);
        setModalVisible(true);
        setMensaje('');
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setProveedorEditando(null);
    };

    const eliminar = async (id) => {
        const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este proveedor?');
        if (!confirmacion) return;

        setEliminandoId(id);
        try {
            await eliminarProveedor(id);
            setMensaje('✅ Proveedor eliminado correctamente');
            await cargarProveedores();
        } catch (err) {
            setMensaje('Error al eliminar proveedor');
        } finally {
            setEliminandoId(null);
        }
    };

    //Filtrar los resultados
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const handleFiltroChange = (e) => {
        setFiltroEstado(e.target.value);
    };

    const proveedoresFiltrados = proveedores.filter((p) => {
        // Si el filtro es 'todos', los muestra todos
        if (filtroEstado === 'todos') return true;
        // Si no, compara el estado del proveedor con el filtro
        return p.estado === filtroEstado;
    });


    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>

            {/*Contenido principal */}
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>Gestión de Proveedores</h1>

                        <button className={stylesCommon.registerBtn} onClick={() => abrirModal()}>
                            Agregar Proveedor
                        </button>

                        {mensaje && <p className={styles.message}>{mensaje}</p>}

                        {/* === FILTROS === */}
                        <div className={stylesCommon.filterContainer}>
                        <select
                            value={filtroEstado}
                            onChange={handleFiltroChange}
                            className={stylesCommon.filterInput}
                        >
                            <option value="todos">Mostrar Todos</option>
                            <option value="activo">Activos</option>
                            <option value="inactivo">Inactivos</option>
                        </select>
                        </div>

                        {cargando ? (
                            <p className={styles.loadingText}>🔄 Cargando proveedores...</p>
                        ) : (
                            <div className={stylesCommon.tableWrapper}>
                                <table className={styles.productTable}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Teléfono</th>
                                            <th>Dirección</th>
                                            <th>Correo</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {proveedores.length > 0 ? (
                                            proveedoresFiltrados.map((p) => (
                                                <tr key={p.idProveedor}>
                                                    <td>{p.nombre}</td>
                                                    <td>{p.telefono}</td>
                                                    <td>{p.direccion}</td>
                                                    <td>{p.correo}</td>
                                                    <td>{p.estado}</td>
                                                    <td className={styles.acciones}>
                                                        <button onClick={() => abrirModal(p)}>✏️</button>
                                                        <button
                                                            onClick={() => eliminar(p.idProveedor)}
                                                            disabled={eliminandoId === p.idProveedor}
                                                        >
                                                            {eliminandoId === p.idProveedor ? '🗑️...' : '🗑️'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className={styles.noData}>
                                                    No hay proveedores registrados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                
                                <button
                                    className={`${stylesCommon.registerBtn} ${stylesCommon.backBtn}`}
                                    type="button"
                                    onClick={() => navigate('/PanelGerente')}
                                    >
                                    VOLVER AL INICIO
                                </button>
                            </div>
                        )}

                        {modalVisible && (
                            <NuevoProveedor
                                proveedor={proveedorEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarProveedores}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default VistaProveedores;
