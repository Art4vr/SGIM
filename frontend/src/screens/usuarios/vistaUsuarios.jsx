import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import EditarUsuario from './editarUsuario';
import stylesCommon from '../../styles/common/common2.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Encabezado from '../../components/Encabezado';
import AlertasInventario from '../../components/AlertasInventario';
import stylesTabla from '../../styles/common/tablas.module.css';
import ModalEliminarUsuarios from "./modalEliminar";


const VistaUsuarios = () => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);

    const cargarUsuarios = async () => {
        setCargando(true);
        try {
            const usuariosRes = await api.get('/api/usuarios');
            setUsuarios(usuariosRes.data);
            const rolesRes = await api.get('/api/roles');
            setRoles(rolesRes.data);
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || 'Error al cargar los datos de los usuarios');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const abrirModal = (usuario = null) => {
        setUsuarioEditando(usuario);
        setModalVisible(true);
        setMensaje('');
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setUsuarioEditando(null);
    };

    const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);    

const confirmarEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarVisible(true);
};


/* const eliminar = async (id) => {
        const usuarionombre = usuarios.find(u => u.idUsuario === id);
        setUsuarioAEliminar(usuario);
        setModalEliminarVisible(true);


        setEliminandoId(id);
        try {
            await api.delete(`/api/usuarios/eliminar/${id}`);
            setMensaje('Usuario eliminado correctamente');
            await cargarUsuarios();
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || 'Error al eliminar usuario');
        } finally {
            setEliminandoId(null);
        }
    };*/

const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    const id = usuarioAEliminar.idUsuario;
    setEliminandoId(id);

    try {
        await api.delete(`/api/usuarios/eliminar/${id}`);
        setMensaje("Usuario eliminado correctamente");
        await cargarUsuarios();
    } catch (err) {
        console.error(err);
        setMensaje(err.response?.data?.mensaje || "Error al eliminar usuario");
    } finally {
        setEliminandoId(null);
        setModalEliminarVisible(false);
        setUsuarioAEliminar(null);
    }
};

    // Justo antes del return, debajo de tus otros useState
        const [filtros, setFiltros] = useState({
        nombre: '',
        rol: '',
        estado: ''
        });

        const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
        };

        // Obtener listas únicas para los selects
        const rolesUnicos = [...new Set(roles.map(r => r.idRol))];
        //hacer que roles unicos tenga el nombre del rol en vez del id
        const rolesUnicosConNombre = rolesUnicos.map(idRol => {
            const rol = roles.find(r => r.idRol === idRol);
            return {
                idRol,
                nombre: rol ? rol.nombre : 'Desconocido'
            };
        });
        const estadosUnicos = [...new Set(usuarios.map(u => u.estado))];

        // Filtrado
        const usuariosFiltrados = usuarios.filter((u) =>
        u.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
        (filtros.rol === '' || u.Rol_idRol === Number(filtros.rol)) &&
        (filtros.estado === '' || u.estado === filtros.estado) 
        );
        

        //mapear que el rol del usuario a base del id obtenga el nombre del rol y la descripcion pero que no intervenga con el filtrado
        usuariosFiltrados.forEach(u => {
            const rol = roles.find(r => r.idRol === u.Rol_idRol);
            u.rol = rol ? rol.nombre : 'Desconocido';
            u.descripcionRol = rol ? rol.descripcion : 'Sin descripción';
        });

        //Prueba de poner iconos en lugar de la descripción de los roles.
        const iconosRol = {
        1: "/imagenes/IconosRoles/Gerente.png",
        2: "/imagenes/IconosRoles/Inventario.png",
        3: "/imagenes/IconosRoles/Chef.png",
        4: "/imagenes/IconosRoles/Mesero.png",
        5: "/imagenes/IconosRoles/Cliente.png"
        };

    return (
        <div>
            {/* Encabezado */}
            <Encabezado/>

            {/*Contenido principal*/}
            <div className={stylesTabla.bodyContainer}>
                <div className={stylesTabla.tablaContainer}>
                    <div className={stylesTabla.tablaCard}>
                        <div className={stylesTabla.encabezadoTabla}>
                        <h1 className={stylesCommon.title}>GESTIÓN DE USUARIOS</h1>

                        <button className={stylesCommon.Btn} onClick={() => navigate('/NuevoUsuario')}>
                            AGREGAR USUARIO
                        </button>
                        </div>
                        {mensaje && <p className={stylesCommon.message}>{mensaje}</p>}

                        {/* === FILTROS === */}
                        <div className={stylesCommon.filterContainer}>
                        <input
                            type="text"
                            placeholder="Filtrar por nombre"
                            value={filtros.nombre}
                            onChange={(e) => handleFiltroChange(e, 'nombre')}
                            className={stylesCommon.filterInput}
                        />

                        <select
                            value={filtros.rol}
                            onChange={(e) => handleFiltroChange(e, 'rol')}
                            className={stylesCommon.filterSelect}
                        >
                            <option value="">Todos los roles</option>
                            {rolesUnicosConNombre.map((rol, idx) => (
                            <option key={idx} value={rol.idRol}>{rol.nombre}</option>
                            ))}
                        </select>

                        <select
                            value={filtros.estado}
                            onChange={(e) => handleFiltroChange(e, 'estado')}
                            className={stylesCommon.filterSelect}
                        >
                            <option value="">Todos los estados</option>
                            {estadosUnicos.map((est, idx) => (
                            <option key={idx} value={est}>{est}</option>
                            ))}
                        </select>
                        </div>

                        {cargando ? (
                            <p >🔄 Cargando usuarios...</p>
                        ) : (
                            <div className={stylesTabla.TableWrapper}>
                                <table className={stylesTabla.Table}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Username</th>
                                            <th>Rol</th>
                                            <th>Descripción</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuariosFiltrados.map((u) => (
                                            <tr key={u.idUsuario}>
                                                <td>{u.nombre}</td>
                                                <td>{u.username}</td>
                                                
                                                {/* === Pone una imagen para representar el rol. === */}
                                                <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <img 
                                                    src={iconosRol[u.Rol_idRol]} 
                                                    alt={u.rol}
                                                    style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                                    />
                                                    {u.rol}
                                                </div>
                                                </td>

                                                <td>{u.descripcionRol}</td>
                                                <td className={`${u.estado === 'activo' ? stylesTabla.estadoactivo : stylesTabla.estadoinactivo}`}>{u.estado}</td>
                                                <td className={stylesCommon.BtnAcciones}>
                                                    <button onClick={() => abrirModal(u)}>✏️</button>
                                                    <button
                                                        onClick={() => confirmarEliminar(u)}
                                                        disabled={eliminandoId === u.idUsuario}
                                                    >
                                                        {eliminandoId === u.idUsuario ? '🗑️...' : '🗑️'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button
                            className={stylesCommon.BtnForm}
                            onClick={() => navigate('/PanelGerente')}
                            >
                            VOLVER AL INICIO
                        </button>
                        {modalVisible && (
                            <EditarUsuario
                                usuario={usuarioEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarUsuarios}
                            />
                        )}

                        {modalEliminarVisible && (
                            <ModalEliminarUsuarios 
                                visible={modalEliminarVisible}
                                usuario={usuarioAEliminar}
                                onConfirm={eliminarUsuario}
                                onClose={() => setModalEliminarVisible(false)}
                            />
                        )}

                    </div>
                </div>
            </div>
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default VistaUsuarios;
