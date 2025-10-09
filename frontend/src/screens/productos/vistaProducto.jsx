import React, { useState, useEffect } from 'react';
import { getProductos, eliminarProducto } from '../../api/productoApi';
import NuevoProducto from './nuevoProducto';
import styles from '../../styles/productos/producto.module.css';

const VistaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);

    const cargarProductos = async () => {
        setCargando(true);
        try {
            const res = await getProductos();
            setProductos(res.data);
        } catch (err) {
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
            setMensaje('Error al eliminar producto');
        } finally {
            setEliminandoId(null);
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h1 className={styles.title}>Gestión de Productos</h1>

                    <button className={styles.registerBtn} onClick={() => abrirModal()}>
                        ➕ Agregar Producto
                    </button>

                    {mensaje && <p className={styles.message}>{mensaje}</p>}

                    {cargando ? (
                        <p className={styles.loadingText}>🔄 Cargando productos...</p>
                    ) : (
                        <div className={styles.tableWrapper}>
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
                                    {productos.map((p) => (
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
    );
};

export default VistaProductos;
