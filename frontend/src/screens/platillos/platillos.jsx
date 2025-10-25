import React, { useState, useEffect } from 'react';
import { getPlatillos, eliminarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import NuevoPlatillo from './nuevoPlatillo';

//Cambiar despues
import styles from '../../styles/productos/producto.module.css';

const VistaPlatillos = () => {
    const [platillos, setPlatillos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [platilloEditando, setPlatilloEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);

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

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h1 className={styles.title}>Gestión de Platillos</h1>

                    <button className={styles.registerBtn} onClick={() => abrirModal()}>
                        ➕ Agregar Platillo
                    </button>

                    {mensaje && <p className={styles.message}>{mensaje}</p>}

                    {cargando ? (
                        <p className={styles.loadingText}>🔄 Cargando platillos...</p>
                    ) : (
                        <div className={styles.tableWrapper}>
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
                                    {platillos.map((p) => (
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
                </div>
            </div>
        </div>
    );
};

export default VistaPlatillos;
