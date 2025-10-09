import React, { useState, useEffect } from 'react';
import { crearProducto, modificarProducto, getCategorias, getUnidades } from '../../api/productoApi';
import styles from '../../styles/productos/producto.module.css';

const NuevoProducto = ({ producto, onClose, onRefresh }) => {
    const [nombre, setNombre] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [idUnidadMedida, setIdUnidadMedida] = useState('');
    const [estado, setEstado] = useState('vigente');
    const [categorias, setCategorias] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [catRes, medRes] = await Promise.all([getCategorias(), getUnidades()]);
                setCategorias(catRes.data);
                setMedidas(medRes.data);
            } catch {
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();

        if (producto) {
            setNombre(producto.nombre);
            setIdCategoria(producto.idCategoria);
            setIdUnidadMedida(producto.idUnidadMedida);
            setEstado(producto.estado || 'vigente');
        } else {
            limpiarCampos();
        }
    }, [producto]);

    const limpiarCampos = () => {
        setNombre('');
        setIdCategoria('');
        setIdUnidadMedida('');
        setEstado('vigente');
        setMensaje('');
        setGuardadoExitoso(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !idCategoria || !idUnidadMedida) {
            setMensaje('Todos los campos son obligatorios');
            return;
        }
        try {
            if (producto) {
                await modificarProducto(producto.idProducto, { nombre, idCategoria, idUnidadMedida, estado });
            } else {
                await crearProducto({ nombre, idCategoria, idUnidadMedida });
            }
            setGuardadoExitoso(true);
            setMensaje('✅ Producto guardado con éxito');
            setTimeout(() => {
                onRefresh();
                onClose();
                limpiarCampos();
            }, 1200);
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || 'Error al guardar');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{producto ? 'Editar Producto' : 'Agregar Producto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>
                    <div className={styles.inputContainer}>
                        <label>Categoría</label>
                        <select value={idCategoria} onChange={e => setIdCategoria(e.target.value)}>
                            <option value="">Selecciona</option>
                            {categorias.map(c => (
                                <option key={c.idCategoria} value={c.idCategoria.toString()}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputContainer}>
                        <label>Unidad de Medida</label>
                        <select value={idUnidadMedida} onChange={e => setIdUnidadMedida(e.target.value)}>
                            <option value={producto.idUnidadMedida}> </option>
                            {medidas.map(m => (
                                <option key={m.idUnidadMedida} value={m.idUnidadMedida.toString()}>
                                    {m.medida} ({m.abreviatura})
                                </option>
                            ))}
                        </select>
                    </div>
                    {producto && (
                        <div className={styles.inputContainer}>
                            <label>Estado</label>
                            <select value={estado} onChange={e => setEstado(e.target.value)}>
                                <option value="vigente">Vigente</option>
                                <option value="descontinuado">Descontinuado</option>
                                <option value="suspendido">Suspendido</option>
                            </select>
                        </div>
                    )}
                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.btnGuardar}>Guardar</button>
                        <button type="button" className={styles.btnCancelar} onClick={() => { onClose(); limpiarCampos(); }}>Cancelar</button>
                    </div>
                    {mensaje && (
                        <p className={`${styles.message} ${guardadoExitoso ? styles.exito : styles.error}`}>{mensaje}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NuevoProducto;
