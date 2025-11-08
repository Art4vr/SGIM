import React, { useState, useEffect, useRef } from "react";

import { format } from "date-fns";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import ModalImprevisto from "./modalImprevisto";
import styles from "../../styles/imprevistos/imprevistos.module.css";
import api from "../../api/axiosConfig";
import stylesCommon from "../../styles/common/common.module.css";

import { getProductos, getUnidades } from "../../api/productoApi";

import PerfilUsuario from "../../components/PerfilUsuario";

const MostrarImprevistos = () => {
    const { logout } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalImprevisto, setModalImprevisto] = useState(null);
    const [imprevistoEditando, setImprevistoEditando] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);
    const [modalAccion, setModalAccion] = useState(null);
    const [formData, setFormData] = useState({ nombre: '' }); // Datos para la edición del imprevisto

    const [productos, setProductos] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [imprevistos, setImprevistos] = useState([]);

    const menuRef = useRef(null);
    const botonRef = useRef(null);

    //se carga toda la informacion de las APIs en el back
    const cargarDatos = async () => {
        setCargando(true);
        try {
            const imprevistosRes = await api.get("/api/imprevistos/listar");
            const productosRes = await getProductos();
            const inventariosRes = await api.get('/api/inventario/')
            const usuariosRes = await api.get("/api/usuarios/");
            const medidasRes = await getUnidades();
            setMedidas(medidasRes.data || []);
            setInventarios(inventariosRes.data.resultados || []);
            setUsuarios(usuariosRes.data || []);
            setProductos(productosRes.data || []);
            setImprevistos(imprevistosRes.data.resultados || []);
            //console.log("medidasRes: ", medidasRes.data);
        } catch (err) {
            setMensaje(
                err.response?.data?.mensaje || err.message || "Error al cargar datos"
            );
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);


    //--------- MODAL PARA AUTORIZACIÓN ----------------
    const abrirModal = (imprevisto = null, mensaje, modalAccion) => {
        setModalImprevisto(imprevisto);
        setModalVisible(true);
        setMensaje(mensaje || "");
        setModalAccion(modalAccion);
        console.log("accion modalImprevisto:", modalAccion);
        if(modalAccion === 'editar') {
            setFormData({
                usuarioReporta: imprevisto.Usuario_idUsuarioReporta,
                usuarioAprueba: imprevisto.Usuario_idUsuarioAutoriza,
                producto: imprevisto.InventarioProducto_idInventarioProducto,
                cantidad: imprevisto.cantidad,
                uMedida : imprevisto.UnidadMedida_idUnidadMedida
            });
        }
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setImprevistoEditando(null);
    };

    const manejarAccion = (modalAccion, confirmar) => {
        console.log("manejarAccion - accion:", modalAccion, "confirmar:", confirmar);
        if(confirmar) {
            switch(modalAccion){
                case 'eliminar':
                    eliminarImprevisto(modalImprevisto, formData);
                    break;
                case 'aprobar':
                    aprobarImprevisto(modalImprevisto, formData);
                    break;
                case 'rechazar':
                    rechazarImprevisto(modalImprevisto, formData);
                    break;
                case 'editar':
                    editarImprevisto(modalImprevisto, formData);
                    break;
                default:
                    console.log("Accion no reconocida");
            }
        }

        setModalVisible(false);
    };

    //------------- ELIMINAR -----------------------------------
    const eliminarImprevisto = async (imprevisto) => {
        setEliminandoId(imprevisto);
        try {
            await api.delete(`/api/imprevistos/eliminar/${imprevisto}`);
            setMensaje("Imprevisto eliminado correctamente");
            await cargarDatos();
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || "Error al eliminar imprevisto");
        } finally {
            setEliminandoId(null);
        }
    };

    //------------- APROBAR -----------------------------------
    const aprobarImprevisto = async (imprevisto) => {
        console.log("imprevistoId: ", imprevisto.idImprevisto)
        //setEliminandoId(imprevisto);
        const datos = {};
        datos.estado = "autorizado";
        //console.log("DATOS: ", datos);
        try {
            await api.put(`/api/imprevistos/evaluar/${imprevisto.idImprevisto}`, datos);
            setMensaje("Imprevisto aprobado correctamente");
            await cargarDatos();
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || "Error al aprobar imprevisto");
        } finally {
            setEliminandoId(null);
        }
    };

    //------------- RECHAZAR -----------------------------------
    const rechazarImprevisto = async (imprevisto) => {
        //console.log("imprevistoId: ", imprevisto.idImprevisto);
        //setEliminandoId(imprevisto);
        const datos = {};
        datos.estado = "rechazado";
        try {
            await api.put(`/api/imprevistos/evaluar/${imprevisto.idImprevisto}`, datos);
            setMensaje("Imprevisto rechazado correctamente");
            await cargarDatos();
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || "Error al rechazar imprevisto");
        } finally {
            setEliminandoId(null);
        }
    };

    //------------- EDITAR -----------------------------------
    const editarImprevisto = async (imprevisto) => {
        const imprevistoId = imprevistos.find((i) => i.idImprevisto === imprevisto);
        //edicion de los datos del imprevisto
        setImprevistoEditando (imprevistoId);
        try {
            await api.put(`/api/imprevistos/editar/${imprevistoId}`, formData);
            setMensaje("Imprevisto editado correctamente");
            await cargarDatos();
        } catch (err) {
            console.error(err);
            setMensaje(err.response?.data?.mensaje || "Error al editar imprevisto");
        } finally {
            setImprevistoEditando(null);
        }
    };

    // Manejar cambios en los campos del formulario (solo para la acción editar)
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //--------------- MENÚ LATERAL-------------------------------
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuAbierto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                botonRef.current &&
                !botonRef.current.contains(event.target)
            ) {
                setMenuAbierto(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuAbierto]);

    //if (loading) return <div>Cargando usuario...</div>;

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    //--------------- FILTROS -------------------------------
    // Justo antes del return, debajo de tus otros useState
    const [filtros, setFiltros] = useState({
        nombre: '',
        fecha: '',
        estado: ''
    });

    const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    // Obtener listas únicas para los selects
    const estadosUnicos = [...new Set(imprevistos.map(e => e.estado))];

    const usuariosUnicos = [...new Set(imprevistos.map(i => i.Usuario_idUsuarioReporta))];
    const usuariosUnicosNombre = usuariosUnicos.map(idUsuario => {
        const usuario = usuarios.find(u => u.idUsuario === idUsuario);
        return{
            idUsuario,
            nombre: usuario ? usuario.nombre : 'Desconocido'
        };
    })

    //filtrado por fechas de manera que se filtre por el mes o semana en que se registraron 
    const fechasUnicas = [...new Set(imprevistos.map(u => {
        const fecha = new Date(u.fecha);
        return `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    }))]; // esto devuleve algo como : ["2023-09", "2023-10", ...] y se puede usar asi: <select>{fechasUnicas.map(fecha => <option key={fecha} value={fecha}>{fecha}</option>)}</select>


    // Filtrado de imprevistos con los filtros de estados, fechas y nombre
    const imprevistosFiltrados = imprevistos.filter((i) =>
        (filtros.nombre === '' || i.Usuario_idUsuarioReporta === Number(filtros.nombre)) &&
        (filtros.estado === '' || i.estado === filtros.estado) &&
        (filtros.fecha ? i.fecha.startsWith(filtros.fecha) : true)
    );


    //Mapeado de datos agregando a imprevistos los datos correspondientes a las llaves foraneas

    imprevistosFiltrados.forEach(i => {
        const nombreUsuarioReporta = usuarios.find(u => u.idUsuario === i.Usuario_idUsuarioReporta);
        const nombreUsuarioAutoriza = usuarios.find(u => u.idUsuario === i.Usuario_idUsuarioAutoriza);
        const idProductoInventario = inventarios.find(n => n.idInventarioProducto === i.InventarioProducto_idInventarioProducto);
        const nombreProducto = productos.find(p => p.idProducto === idProductoInventario.Producto_idProducto);
        const unidadMedida = medidas.find(m => m.idUnidadMedida === i.UnidadMedida_idUnidadMedida);

        i.usuarioReporta = nombreUsuarioReporta ? nombreUsuarioReporta.nombre : 'Usuario Desconocido';
        i.usuarioAprueba = nombreUsuarioAutoriza ? nombreUsuarioAutoriza.nombre : '...';
        i.producto = nombreProducto ? nombreProducto.nombre : 'Producto Desconocido'; 
        i.medida = unidadMedida ? unidadMedida.abreviatura : 'Medida Desconocida';
    });




    return (
        <div className={stylesCommon.bodyContainer}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                {/* ESTA ES LA PARTE CLAVE (Derecha) */}
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" /> {}
                </div>
            </div>

            {/* Sidebar */}
            <div
                ref={menuRef}
                className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ""
                    }`}
            >
                <ul>
                    <li onClick={() => navigate("/Platillos")}>Platillos</li>
                    <li onClick={() => navigate("/Proveedores")}>Proveedores</li>
                    <li onClick={() => navigate("/Productos")}>Productos</li>
                    <li onClick={() => navigate("/Imprevistos")}>Ver Imprevistos</li>
                    <li onClick={() => navigate("/Inventario")}>Ver Inventario</li>
                    <li onClick={() => navigate("/NuevoUsuario")}>Nuevo Usuario</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenedor principal */}
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Lista de Imprevistos</h2>

                    {mensaje && <p className={stylesCommon.message}>{mensaje}</p>}

                    {/* Filtros */}
                    <div className={stylesCommon.filterContainer}>
                    <select
                        value={filtros.nombre}
                        onChange={(e) => handleFiltroChange(e, 'nombre')}
                        className={stylesCommon.filterSelect}
                    >
                        <option value="">Todos los usuarios</option>
                        {usuariosUnicosNombre.map((usr, idx) => (
                        <option key={idx} value={usr.idUsuario}>{usr.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={filtros.fecha}
                        onChange={(e) => handleFiltroChange(e, 'fecha')}
                        className={stylesCommon.filterSelect}
                    >
                        <option value="">Todas las fechas</option>
                        {fechasUnicas.map((fecha, idx) => (
                        <option key={idx} value={fecha}>{fecha}</option>
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
                        <p className={styles.loadingText}>🔄 Cargando imprevistos...</p>
                    ) : (
                        <div className={stylesCommon.tableWrapper}>
                            {cargando ? (
                                <div style={{ padding: 20 }}>
                                    <ClipLoader size={30} color="#000" />
                                </div>
                            ) : (
                                <table className={styles.Table || ""}>
                                    <thead>
                                        <tr>
                                            <th>Reportado por</th>
                                            <th>Producto</th>
                                            <th>Descripción</th>
                                            <th>Cantidad</th>
                                            <th>Unidad</th>
                                            <th>Aprobado por</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {imprevistosFiltrados.length > 0 ? (
                                            imprevistosFiltrados.map((imp) => (
                                                <tr key={imp.idImprevisto}>
                                                    <td>{imp.usuarioReporta}</td>
                                                    <td>{imp.producto}</td>
                                                    <td>{imp.descripcion}</td>
                                                    <td>{imp.cantidad}</td>
                                                    <td>{imp.medida}</td>
                                                    <td>{imp.usuarioAprueba}</td>
                                                    <td>
                                                        {imp.fecha
                                                            ? format(new Date(imp.fecha), "dd/MM/yyyy HH:mm:ss")
                                                            : ""}
                                                    </td>
                                                    <td>{imp.estado}</td>
                                                    <td className={styles.acciones}>
                                                        <button onClick={() => abrirModal(imp, "¿Estás seguro de aprobar este imprevisto?", "aprobar")}>✅ Autorizar</button>
                                                        <button onClick={() => abrirModal(imp, "¿Estás seguro de rechazar este imprevisto?", "rechazar")}>❌ Rechazar</button>
                                                        <button
                                                            onClick={() => abrirModal(imp.idImprevisto, "¿Estás seguro de eliminar este imprevisto?", "eliminar")}
                                                            disabled={eliminandoId === imp.idImprevisto}
                                                        >
                                                            {eliminandoId === imp.idImprevisto ? '🗑️...' : '🗑️ Eliminar'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" style={{ textAlign: "center" }}>
                                                    No hay imprevistos registrados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                    {/* Back button */}
                    <button
                        className={stylesCommon.backBtn}
                        onClick={() => navigate("/PanelGerente")}
                    >
                        VOLVER AL INICIO
                    </button>
                    {modalVisible && (
                        <ModalImprevisto
                            visible={modalVisible}
                            mensaje={mensaje}
                            modalAccion={modalAccion}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            manejarAccion={manejarAccion}
                            onClose={cerrarModal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MostrarImprevistos;
