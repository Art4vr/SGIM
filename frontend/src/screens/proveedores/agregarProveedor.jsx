// pantalla para agregar un nuevo proveedor mediante un registro
import React, { useState, useEffect } from 'react';
import styles from '../../styles/productos/producto.module.css';

import { modificarProveedor,crearProveedor } from '../../api/proveedorApi';

const NuevoProveedor = ({ proveedor, onClose, onRefresh }) => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [estado, setEstado] = useState('activo');
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                if (proveedor) {
                    setNombre(proveedor.nombre || '');
                    setTelefono(proveedor.telefono || '');
                    setDireccion(proveedor.direccion || '');
                    setCorreo(proveedor.correo || '');
                    setEstado(proveedor.estado || 'activo');
                } else {
                    limpiarCampos();
                }
            } catch {
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();
    }, [proveedor]);

    const limpiarCampos = () => {
        setNombre('');
        setTelefono('');
        setDireccion('');
        setCorreo('');
        setEstado('activo');
        setMensaje('');
        setGuardadoExitoso(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !telefono || !correo) {
            setMensaje('⚠️ Los campos Nombre, Teléfono y Correo son obligatorios');
            return;
        }

        try {
            if (proveedor) {
                await modificarProveedor(proveedor.idProveedor, { nombre, telefono, direccion, correo, estado });
            } else {
                await crearProveedor({ nombre, telefono, direccion, correo });
            }

            setGuardadoExitoso(true);
            setMensaje('✅ Proveedor guardado con éxito');
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
                <h2 className={styles.modalTitle}>
                    {proveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>

                    {/* Teléfono */}
                    <div className={styles.inputContainer}>
                        <label>Teléfono</label>
                        <input type="text" value={telefono} onChange={e => setTelefono(e.target.value)} />
                    </div>

                    {/* Dirección */}
                    <div className={styles.inputContainer}>
                        <label>Dirección</label>
                        <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} />
                    </div>

                    {/* Correo */}
                    <div className={styles.inputContainer}>
                        <label>Correo</label>
                        <input type="text" value={correo} onChange={e => setCorreo(e.target.value)} />
                    </div>

                    {/* Estado (solo si se edita un proveedor existente) */}
                    {proveedor && (
                        <div className={styles.inputContainer}>
                            <label>Estado</label>
                            <select value={estado} onChange={e => setEstado(e.target.value)}>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    )}

                    {/* Botones */}
                    <div className={styles.modalButtons}>
                        <button type="submit" className={styles.btnGuardar}>Guardar</button>
                        <button
                            type="button"
                            className={styles.btnCancelar}
                            onClick={() => { onClose(); limpiarCampos(); }}
                        >
                            Cancelar
                        </button>
                    </div>

                    {/* Mensaje */}
                    {mensaje && (
                        <p className={`${styles.message} ${guardadoExitoso ? styles.exito : styles.error}`}>
                            {mensaje}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NuevoProveedor;
