//pantalla para visualizar detalles de un platillo
import React, { useState, useEffect } from 'react';
import { crearPlatillo, modificarPlatillo } from '../../api/platilloApi';

//Cambiar estilos
import styles from '../../styles/platillos/nuevoPlatillo.module.css';

const NuevoPlatillo = ({ platillo, onClose, onRefresh }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [estado, setEstado] = useState('disponible');
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                if (platillo) {
                    setNombre(platillo.nombre || '');
                    setDescripcion(platillo.descripcion || '');
                    setPrecio(platillo.precio || '')
                    setEstado(platillo.estado || 'disponible');
                } else {
                    limpiarCampos();
                }
            } catch {
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();
    }, [platillo]);

    const limpiarCampos = () => {
        setNombre('');
        setDescripcion('');
        setPrecio('');
        setEstado('vigente');
        setMensaje('');
        setGuardadoExitoso(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !precio ) {
            setMensaje('Campos obligatorios, nombre y precio');
            return;
        }
        try {
            if (platillo) {
                await modificarPlatillo(platillo.idPlatillo, { nombre, descripcion, precio, estado });
            } else {
                await crearPlatillo({ nombre, descripcion, precio });
            }
            setGuardadoExitoso(true);
            setMensaje('✅ Platillo guardado con éxito');
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
                <h2 className={styles.modalTitle}>{platillo ? 'Editar Platillo' : 'Agregar Platillo'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>

                    {/* Descripcion */}
                    <div className={styles.inputContainer}>
                        <label>Descripcion</label>
                        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                    </div>

                    {/* Precio */}
                    <div className={styles.inputContainer}>
                        <label>Precio</label>
                        <input type="text" value={precio} onChange={e => setPrecio(e.target.value)} />
                    </div>

                    {/* Estado (solo para edición) */}
                    {platillo && (
                        <div className={styles.inputContainer}>
                            <label>Estado</label>
                            <select value={estado} onChange={e => setEstado(e.target.value)}>
                                <option value="Disponible">Disponible</option>
                                <option value="Agotado">Agotado</option>
                                <option value="Descontinuado">Descontinuado</option>
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

export default NuevoPlatillo;
