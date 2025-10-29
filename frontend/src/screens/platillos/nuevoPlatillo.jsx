import React, { useState, useEffect } from 'react';
import { crearPlatillo, modificarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import styles from '../../styles/platillos/nuevoPlatillo.module.css';
import stylesCommon from '../../styles/common/common.module.css';

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
                const [catRes] = await Promise.all([getCategoriasPlatillo()]);
                // Formatear categorías para el select
                const categoriasFormateadas = catRes.data.map(c => ({
                    idCategoria: c.id_categoria_platillo.toString(),
                    nombre: c.nombre
                }));
                setCategorias(categoriasFormateadas);

                if (platillo) {
                    setNombre(platillo.nombre || '');
                    setDescripcion(platillo.descripcion || '');
                    setIdCategoria(platillo.id_categoria?.toString() || '');
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

        const datos = {};

        if (platillo) {
            // Solo enviar campos que cambiaron
            if (nombre.trim() !== platillo.nombre) datos.nombre = nombre;
            if (descripcion !== platillo.descripcion) datos.descripcion = descripcion || null;
            if (idCategoria && idCategoria !== platillo.id_categoria?.toString()) datos.idCategoria = idCategoria;
            if (imagen !== platillo.imagen) datos.imagen = imagen || null;
            if (precio !== platillo.precio) datos.precio = precio;
            if (estado !== platillo.estado) datos.estado = estado;

            if (idCategoria) {
                datos.idCategoria = Number(idCategoria);
            }

            if (Object.keys(datos).length === 0) {
                setMensaje('No hay cambios para guardar');
                return;
            }
        } else {
            if (!nombre || !idCategoria || !precio) {
                setMensaje('Campos obligatorios: nombre, precio y categoría');
                return;
            }
            datos.nombre = nombre;
            datos.descripcion = descripcion || null;
            datos.idCategoria = idCategoria;
            datos.imagen = imagen || null;
            datos.precio = precio;
            datos.estado = estado;
        }

        try {
            if (platillo) {
                await modificarPlatillo(platillo.idPlatillo, datos);
            } else {
                await crearPlatillo(datos);
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
                        {!platillo && <option value="" disabled>Selecciona una categoría</option>}
                        {platillo && <option value={platillo.id_categoria}>{platillo.categoria}</option>}
                        {categorias.map(c => (
                            <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
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
