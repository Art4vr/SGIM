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

                if (producto) {
                    setNombre(producto.nombre || '');
                    setIdCategoria(producto.idCategoria?.toString() || '');
                    setIdUnidadMedida(producto.idUnidadMedida?.toString() || '');
                    setEstado(producto.estado || 'vigente');
                } else {
                    limpiarCampos();
                }
            } catch {
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();
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
                    {/* Nombre */}
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>

                    {/* Categoría */}
                    <div className={styles.inputContainer}>
                        <label>Categoría</label>
                        <select value={idCategoria} onChange={e => setIdCategoria(e.target.value)}>
                            {/* Opción actual del producto */}
                            {producto && <option value={producto.idCategoria}>{producto.categoria}</option>}
                            {/* Otras opciones disponibles */}
                            {categorias
                                .filter(c => c.idCategoria !== producto?.idCategoria) // evitar repetir
                                .map(c => (
                                    <option key={c.idCategoria} value={c.idCategoria.toString()}>
                                        {c.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Unidad de Medida */}
                    <div className={styles.inputContainer}>
                        <label>Unidad de Medida</label>
                        <select value={idUnidadMedida} onChange={e => setIdUnidadMedida(e.target.value)}>
                            {/* Opción actual del producto */}
                            {producto && <option value={producto.idUnidadMedida}>{producto.unidad}</option>}
                            {/* Otras opciones disponibles */}
                            {medidas
                                .filter(m => m.idUnidadMedida !== producto?.idUnidadMedida) // evitar repetir
                                .map(m => (
                                    <option key={m.idUnidadMedida} value={m.idUnidadMedida.toString()}>
                                        {m.medida} ({m.abreviatura})
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Estado (solo para edición) */}
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

                    {/* Botones */}
                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.btnGuardar}>Guardar</button>
                        <button type="button" className={styles.btnCancelar} onClick={() => { onClose(); limpiarCampos(); }}>Cancelar</button>
                    </div>

                    {/* Mensaje */}
                    {mensaje && (
                        <p className={`${styles.message} ${guardadoExitoso ? styles.exito : styles.error}`}>{mensaje}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NuevoProducto;
