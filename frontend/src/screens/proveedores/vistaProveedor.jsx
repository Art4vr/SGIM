import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import NuevoProveedor from './agregarProveedor';
import styles from '../../styles/productos/producto.module.css';

// Funciones API
export const getProveedores = () => api.get('/api/proveedores');
export const eliminarProveedor = (id) => api.delete(`/api/proveedores/${id}`);

const VistaProveedores = () => {
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
            setMensaje('❌ Error al cargar proveedores');
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
            setMensaje('❌ Error al eliminar proveedor');
        } finally {
            setEliminandoId(null);
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h1 className={styles.title}>Gestión de Proveedores</h1>

                    <button className={styles.registerBtn} onClick={() => abrirModal()}>
                        ➕ Agregar Proveedor
                    </button>

                    {mensaje && <p className={styles.message}>{mensaje}</p>}

                    {cargando ? (
                        <p className={styles.loadingText}>🔄 Cargando proveedores...</p>
                    ) : (
                        <div className={styles.tableWrapper}>
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
                                        proveedores.map((p) => (
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
    );
};

export default VistaProveedores;
