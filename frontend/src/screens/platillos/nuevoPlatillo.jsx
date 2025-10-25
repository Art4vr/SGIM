import React, { useState, useEffect } from 'react';
import { crearPlatillo, modificarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import styles from '../../styles/productos/producto.module.css';

const NuevoPlatillo = ({ platillo, onClose, onRefresh }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idCategoria, setIdCategoria] = useState('');
    const [imagen, setImagen] = useState('');
    const [precio, setPrecio] = useState('');
    const [estado, setEstado] = useState('disponible');
    const [categorias, setCategorias] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const catRes = await getCategoriasPlatillo();
                const categoriasFormateadas = catRes.data.map(c => ({
                    idCategoria: c.id_categoria_platillo,
                    nombre: c.nombre
                }));
                setCategorias(categoriasFormateadas);

                if (platillo) {
                    setNombre(platillo.nombre || '');
                    setDescripcion(platillo.descripcion || '');
                    setIdCategoria(platillo.id_categoria_platillo?.toString() || '');
                    setImagen(platillo.imagen || '');
                    setPrecio(platillo.precio || '');
                    setEstado(platillo.estado || 'disponible');
                } else {
                    limpiarCampos();
                }
            } catch (err) {
                console.error(err);
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();
    }, [platillo]);

    const limpiarCampos = () => {
        setNombre('');
        setDescripcion('');
        setIdCategoria('');
        setImagen('');
        setPrecio('');
        setEstado('disponible');
        setMensaje('');
        setGuardadoExitoso(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !precio || !idCategoria) {
            setMensaje('Campos obligatorios: nombre, precio y categoría');
            return;
        }

        try {
            if (platillo) {
                await modificarPlatillo(platillo.idPlatillo, { 
                    nombre, descripcion, idCategoria, imagen, precio, estado 
                });
            } else {
                await crearPlatillo({ nombre, descripcion, idCategoria, imagen, precio });
            }

            setGuardadoExitoso(true);
            setMensaje('✅ Platillo guardado con éxito');

            setTimeout(() => {
                onRefresh();
                onClose();
                limpiarCampos();
            }, 1200);

        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || 'Error al guardar platillo');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{platillo ? 'Editar Platillo' : 'Agregar Platillo'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Descripción</label>
                        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Categoría</label>
                        <select value={idCategoria} onChange={e => setIdCategoria(e.target.value)}>
                            
                            
                            {platillo && <option value={platillo.idCategoria}>{platillo.categoria}</option>}
                            {categorias.map(c => (
                                <option key={c.idCategoria} value={c.idCategoria}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Imagen</label>
                        <input type="text" value={imagen} onChange={e => setImagen(e.target.value)} />
                    </div>

                    <div className={styles.inputContainer}>
                        <label>Precio</label>
                        <input type="text" value={precio} onChange={e => setPrecio(e.target.value)} />
                    </div>

                    {platillo && (
                        <div className={styles.inputContainer}>
                            <label>Estado</label>
                            <select value={estado} onChange={e => setEstado(e.target.value)}>
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="descontinuado">Descontinuado</option>
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

export default NuevoPlatillo;
