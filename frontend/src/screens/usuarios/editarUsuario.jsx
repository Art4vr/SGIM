import React, { useState, useEffect } from 'react';
import styles from '../../styles/productos/producto.module.css';
import api from '../../api/axiosConfig';

const EditarUsuario = ({ usuario, onClose, onRefresh }) => {
    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [idRol, setIdRol] = useState('');
    const [estado, setEstado] = useState('activo');
    const [roles, setRoles] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const rolRes = await api.get('/api/roles');
                setRoles(rolRes.data);

                if (usuario) {
                    setNombre(usuario.nombre || '');
                    setUsername(usuario.username || '');
                    setIdRol(usuario.idRol?.toString() || '');
                    setEstado(usuario.estado || '');
                } else {
                    limpiarCampos();
                }
            } catch {
                setMensaje('Error al cargar datos');
            }
        };
        cargarDatos();
    }, [usuario]);

    const limpiarCampos = () => {
        setNombre('');
        setUsername('');
        setIdRol('');
        setEstado('activo');
        setMensaje('');
        setGuardadoExitoso(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datos = {};

        if (usuario) {
            // Edición: solo enviar los campos que cambiaron
            console.log("datos usuario:", usuario);
            if (nombre.trim() !== usuario.nombre) datos.nombre = nombre; //aqui se realiza la comparacion para ver si hubo cambios y de ser asi agregarlos al objeto datos
            if (username.trim() !== usuario.username) datos.username = username;
            if (idRol !== usuario.idRol?.toString()) datos.idRol = idRol;
            if (estado !== usuario.estado) datos.estado = estado;

            if (Object.keys(datos).length === 0) {
                setMensaje('No hay cambios para guardar');
                return;
            }
        }

        try {
            //console.log("roles:", roles);
            if (usuario) {
                console.log("Datos a enviar:", datos);
                await api.put(`/api/usuarios/editar/${usuario.idUsuario}`, datos);
            }
            setGuardadoExitoso(true);
            setMensaje('✅ Usuario guardado con éxito');
            setTimeout(() => {
                onRefresh();
                onClose();
                limpiarCampos();
            }, 400);
        } catch (err) {
            console.log("err: ", err);
            setMensaje(err.response?.data?.mensaje || 'Error al guardar');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{'Editar Usuario'}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className={styles.inputContainer}>
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>

                    {/* Username */}
                    <div className={styles.inputContainer}>
                        <label>Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>

                    {/* Rol */}
                    <div className={styles.inputContainer}>
                        <label>Rol</label>
                        <select value={idRol} onChange={e => setIdRol(e.target.value)}>
                            {!usuario && <option value="" disabled>Seleccione un rol</option>}
                            {usuario && <option value={usuario.Rol_idRol}>{roles.find(r => r.idRol === usuario.Rol_idRol)?.nombre}</option>}
                            {roles
                                .filter(r => r.idRol !== usuario?.idRol)
                                .map(r => (
                                    <option key={r.idRol} value={r.idRol.toString()}>
                                        {r.nombre}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Estado (solo edición) */}
                    {usuario && (
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
                        <p className={`${styles.message} ${guardadoExitoso ? styles.exito : styles.error}`}>{mensaje}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditarUsuario;