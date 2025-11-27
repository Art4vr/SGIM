//Vista general del inventario
//Muestra una tabla con el inventario de productos con sus respectivos lotes
//En caso de que haya mas de un inventario por producto, ordenara primero los que tengan la fecha de ingreso (fechaIngreso) más antigua
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/inventario/inventario.module.css';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common2.module.css';
import stylesTabla from '../../styles/common/tablas.module.css';
import { getProductos, getUnidades, getCategorias } from '../../api/productoApi';
import { getProveedores } from '../../api/proveedorApi';
import ModalEliminarInventario from './modalInventario';
import AlertasInventario from '../../components/AlertasInventario';
import Encabezado from '../../components/Encabezado';
import { BsJustify } from 'react-icons/bs';

//funcion para establecer un nuevo estado de acuerdo a la evaluacion de fecha de caducidad o stock que se establecio para las alertas
    //fecha actual <=  fecha de caducidad -> 'caducado'
    //fecha actual >  fecha de caducidad por poco-> 'pronto a caducar'
    //cantidad actual <= cantidad minima -> 'bajo stock'
    //cantidad actual > cantidad minima -> 'en stock'
    //cantidad actual == 0 -> 'finalizado'
    const evaluarEstado = async (item) => {
        const hoy = new Date();
        //console.log("item: ", item);
        //console.log("EVALUANDO ESTADO PARA ITEM: ", item);
        if (Number(item.cantidadActual) === 0 || item.cantidadActual === '0' || Number(item.cantidadActual) === 0.0 || Number(item.cantidadActual) < 0.0) {
            //console.log("finalizado: ");
            return 'finalizado';
        } else if (item.fechaCaducidad) {
            const fechaCad = new Date(item.fechaCaducidad);
            if (hoy >= fechaCad) {
                //console.log("caducado: ");
                return 'caducado';
            } else {
                const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));   
                if (diffDays <= 2) {
                    //console.log("pronto_a_caducar: ");
                    return 'pronto_a_caducar';
                }
            }
        }
        if (item.cantidadActual != null && item.cantidadMinima != null) {
            console.log("EVALUANDO STOCK PARA ITEM else: ", item);
            console.log("Number(item.cantidadActual) <= Number(item.cantidadMinima): ", Number(item.cantidadActual) <= Number(item.cantidadMinima));
            if (Number(item.cantidadActual) <= Number(item.cantidadMinima)) {
                //console.log("bajo_stock: ");
                return 'bajo_stock';
            } else {
                //console.log("en_stock: ");
                return 'en_stock';
            }
        }
    };

    // Function to update states in backend (call this once after mapping)
const actualizarEstadosEnBackend = async (inventarios) => {
    for (const item of inventarios) {
        //console.log("item: ", item);
        const nuevoEstado = await evaluarEstado(item);
        //console.log("nuevoEstado: ", nuevoEstado);
        if (nuevoEstado !== item.estado) {
            try {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: nuevoEstado});
            } catch (err) {
                console.error(`Error actualizando estado para ${item.idInventarioProducto}:`, err);
            }
        }
    }
};

const VistaInventario = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInventario, setModalInventario] = useState(null);
    const [modalAccion, setModalAccion] = useState(null);
    const [inventarioEditando, setInventarioEditando] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);

    const { loading, logout, user } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [listaInventario, setListaInventario] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    //Alertas
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [expiringAlerts, setExpiringAlerts] = useState([]);
    const [showLowStockAlert, setShowLowStockAlert] = useState(true);
    const [showExpiringAlert, setShowExpiringAlert] = useState(true);


    // Cargar productos e inventario

    // Cargar datos solo de inventarios (lightweight)
    const cargarInventarios = async () => {
        try {
            const inventariosRes = await api.get("/api/inventario");
            setInventarios(inventariosRes.data.resultados || []);
        } catch (err) {
            console.error("Error al cargar inventarios:", err);
        }
    };

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [productosRes, inventariosRes, medidasRes, proveedoresRes, categoriasRes, usuariosRes] = await Promise.all([
                getProductos(),
                api.get('/api/inventario'),
                getUnidades(),
                getProveedores(),
                getCategorias(),
                api.get('/api/usuarios')
            ]);

            setProductos(productosRes.data || []);
            setInventarios(inventariosRes.data.resultados || []);
            setMedidas(medidasRes.data || []);
            setProveedores(proveedoresRes.data || []);
            setCategorias(categoriasRes.data || []);
            setUsuarios(usuariosRes.data || []);

            await actualizarEstadosEnBackend(inventariosRes.data.resultados || []);
        } catch (err) {
            setMensaje('Error al cargar datos' + (err.response?.data?.mensaje || err.message));
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);


    //aca se va a mapear que la tabla inventarioProducto jale la informacion de otras tablas como productos o unidadMedida, para no mostrar solo id's
    //se crea una nueva lista ya con los datos mapeados y se guarda en listaInventario
    useEffect(() => {
        const lista = inventarios.map((inventario) => {
            //const estado = evaluarEstado(inventario);
            //console.log("estado-useefect: ", estado);
            const producto = productos.find((p) => p.idProducto === inventario.Producto_idProducto);
            const unidadMedida = medidas.find((m) => m.idUnidadMedida === inventario.UnidadMedida_idUnidadMedida);// aqui se busca la unidad de medida del producto
            const proveedor = proveedores.find((pr) => pr.idProveedor === inventario.Proveedor_idProveedor); // aqui se busca el proveedor del inventario
            const usuario = usuarios.find((u) => u.idUsuario === inventario.Usuario_idUsuario); // aqui se busca el usuario que registro el inventario
            return {// se devuelve un nuevo objeto con los datos del inventario y los nombres de producto y unidad
                ...inventario,
                //estado: estado,
                nombreProducto: producto ? producto.nombre : 'Desconocido',
                nombreUnidad: unidadMedida ? unidadMedida.medida : 'Desconocida',
                nombreProveedor: proveedor ? proveedor.nombre : 'Desconocido',
                username: usuario ? usuario.username : 'Desconocido'
            };
        });
        setListaInventario(lista);
        //console.log("LISTA INVENTARIO MAPEADA: ", lista);
    }, [inventarios, productos, medidas, proveedores, usuarios]);

    //--------- MODAL PARA ELIMINAR ----------------
    const abrirModal = (inventario = null, mensaje, modalAccion) => {
        setModalInventario(inventario);
        setModalVisible(true);
        setMensaje(mensaje || "");
        setModalAccion(modalAccion);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setInventarioEditando(null);
        setModalAccion(null);
    };

    const manejarAccion = async ( confirmar, estado = null) => {
        if(confirmar) {
            if(modalAccion === "eliminar"){
                await eliminarInventario(modalInventario);
            }
        }
        cerrarModal();
    };

    //------------- ELIMINAR -----------------------------------
    const eliminarInventario = async (inventario) => {
        setEliminandoId(inventario);// es el id
        try {
            await api.delete(`/api/inventario/${inventario}`);
            setMensaje("inventario eliminado correctamente");
            await cargarDatos();
        } catch (err) {
            console.error(err);
            setMensaje("Error al eliminar Inventario: Valor ya usado en otra tabla"|| err.response?.data?.mensaje); //err.response?.data?.mensaje + 
        } finally {
            setEliminandoId(null);
        }
    };


    if (loading) {
        return <div className={styles.loading}><ClipLoader /></div>;
    }

    console.log("lista de inventario: ", listaInventario);

    return (
            <div>
                {/* Encabezado */}
                <Encabezado/>

                {/* Non-blocking alert boxes (keeps existing styles) */}
                <div className={stylesTabla.bodyContainer}>
                    <div className={stylesTabla.tablaContainer}>
                    {showLowStockAlert && lowStockAlerts.length > 0 && (
                        <div className={stylesCommon.message} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos con bajo stock ({lowStockAlerts.length}):</strong>
                            <ul style={{ margin: '8px 0 0 16px' }}>
                                {lowStockAlerts.map(item => (
                                    <li key={item.idInventarioProducto}>
                                        {item.nombreProducto} — {item.cantidadActual} (mín {item.cantidadMinima})
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setShowLowStockAlert(false)} style={{ marginLeft: 8 }}>
                                Cerrar
                            </button>
                        </div>
                    )}

                    {showExpiringAlert && expiringAlerts.length > 0 && (
                        <div className={stylesCommon.message} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
                            <strong>Productos cerca de caducidad ({expiringAlerts.length}):</strong>
                            <ul style={{ margin: '8px 0 0 16px' }}>
                                {expiringAlerts.map(item => (
                                    <li key={item.idInventarioProducto}>
                                        {item.nombreProducto} — caduca: {item.fechaCaducidad ? format(new Date(item.fechaCaducidad), 'dd/MM/yyyy') : 'N/A'}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => setShowExpiringAlert(false)} style={{ marginLeft: 8 }}>
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>


            {/* Main Content */}
            <div className={stylesTabla.tablaCard}>
                <div className={stylesTabla.encabezadoTabla}>
                    <h2 className={stylesCommon.title}>Inventario Actual</h2>   
                    <button 
                        className={stylesCommon.Btn} 
                        onClick={() => navigate('/actualizarstock')}
                    >
                        <span>+</span> Actualizar Stock
                    </button>
                </div>
                {mensaje && <div className={stylesCommon.message}>{mensaje}</div>}
                
                {cargando ? (
                    <div><ClipLoader /></div>
                ) : (
                    <div className={stylesTabla.TableWrapper}>
                        <table className={stylesTabla.Table}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Proveedor</th>
                                    <th>Stock actual</th>
                                    <th>Cantidad Mínima</th>
                                    <th>Cantidad Máxima</th>
                                    <th>Unidad de Medida</th>
                                    <th>Fecha de Ingreso</th>
                                    <th>Fecha de Caducidad</th>
                                    <th>Usuario que Registró</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaInventario.map((item) => (
                                    <tr key={item.idInventarioProducto}>
                                        <td>{item.nombreProducto}</td>
                                        <td>{item.nombreProveedor}</td>
                                        <td>{Number(item.cantidadActual) * medidas.find(medida => medida.idUnidadMedida === item.UnidadMedida_idUnidadMedida)?.factorConversion}</td>
                                        <td>{item.cantidadMinima * medidas.find(medida => medida.idUnidadMedida === item.UnidadMedida_idUnidadMedida)?.factorConversion}</td>
                                        <td>{item.cantidadMaxima * medidas.find(medida => medida.idUnidadMedida === item.UnidadMedida_idUnidadMedida)?.factorConversion}</td>
                                        <td>{medidas.find(m => m.medida === item.nombreUnidad).medidaEquivalente}</td>
                                        <td>{item.fechaIngreso ? format(new Date(item.fechaIngreso), 'dd/MM/yyyy HH:mm:ss') : ''}</td>
                                        <td>{item.fechaCaducidad ? format(new Date(item.fechaCaducidad), 'dd/MM/yyyy') : ''}</td>
                                        <td>{item.username}</td>
                                        <td><span className={styles[`estado_${item.estado}`]}>{item.estado}</span></td>
                                        <td className={stylesCommon.BtnAcciones}>
                                            <button
                                                onClick={() => abrirModal(item.idInventarioProducto, "¿Estás seguro de eliminar este Inventario?", "eliminar")}
                                                disabled={eliminandoId === item.idInventarioProducto}
                                            >🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/*Botón de volver al panel*/}
                {user?.rol===1 &&(
                    <button className={stylesCommon.BtnForm} onClick={() => navigate('/PanelGerente')}>
                        Volver al Inicio
                    </button>
                )}

                {user?.rol===2 &&(
                    <button className={stylesCommon.BtnForm} onClick={() => navigate('/PanelEncargado')}>
                        Volver al Inicio
                    </button>
                )}
                {modalVisible && (
                        modalAccion === 'eliminar' ? (
                        <ModalEliminarInventario
                            visible={modalVisible}
                            mensaje={mensaje}
                            modalAccion={modalAccion}
                            manejarAccion={manejarAccion}
                            onClose={cerrarModal}
                        />
                    ) : null
                    )}
            </div>
            </div>
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default VistaInventario;
