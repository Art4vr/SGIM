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
import stylesCommon from '../../styles/common/common.module.css';
import { getProductos, getUnidades, getCategorias } from '../../api/productoApi';
import { getProveedores } from '../../api/proveedorApi';
import ModalEliminarInventario from './modalInventario';
import AlertasInventario from '../../components/AlertasInventario';
import Encabezado from '../../components/Encabezado';


const VistaInventario = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalInventario, setModalInventario] = useState(null);
    const [modalAccion, setModalAccion] = useState(null);
    const [inventarioEditando, setInventarioEditando] = useState(null);
    const [eliminandoId, setEliminandoId] = useState(null);

    const { logout, loading, user } = useAuth();
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
            evaluarEstado(inventario); 
            //const estado = evaluarEstado(inventario); 
            //console.log("INVENTARIO EVALUADO: ", inventario);
            //console.log("ESTADO EVALUADO: ", estado);
            const producto = productos.find((p) => p.idProducto === inventario.Producto_idProducto);
            const unidadMedida = medidas.find((m) => m.idUnidadMedida === inventario.UnidadMedida_idUnidadMedida);// aqui se busca la unidad de medida del producto
            const proveedor = proveedores.find((pr) => pr.idProveedor === inventario.Proveedor_idProveedor); // aqui se busca el proveedor del inventario
            const usuario = usuarios.find((u) => u.idUsuario === inventario.Usuario_idUsuario); // aqui se busca el usuario que registro el inventario
            return {// se devuelve un nuevo objeto con los datos del inventario y los nombres de producto y unidad
                ...inventario,
                //estado: estado,
                nombreProducto: producto ? producto.nombre : 'Desconocido',
                nombreUnidad: unidadMedida ? unidadMedida.abreviatura : 'Desconocida',
                nombreProveedor: proveedor ? proveedor.nombre : 'Desconocido',
                username: usuario ? usuario.username : 'Desconocido'
            };
        });
        setListaInventario(lista);
    }, [inventarios, productos, medidas, proveedores, usuarios]);

    //Ahora se va a hacer una especie de alerta o modal para cuando un inventario de producto sea igual a su cantidad minima se muestre en pantalla
    //Igual si la fecha de caducidad esta cerca (por ejemplo 2 dias) se lanza una alerta pero de caducidad
    /*useEffect(() => {
        if (!listaInventario || listaInventario.length === 0) {
            setLowStockAlerts([]);
            setExpiringAlerts([]);
            setShowLowStockAlert(false);
            setShowExpiringAlert(false);
            return;
        }

        const low = listaInventario.filter(item =>
            item.cantidadActual != null &&
            item.cantidadMinima != null &&
            Number(item.cantidadActual) <= Number(item.cantidadMinima)
        );

        const hoy = new Date();
        const expiringThresholdDays = 2; // adjust threshold here
        const exp = listaInventario.filter(item => {
            if (!item.fechaCaducidad) return false;
            const fechaCad = new Date(item.fechaCaducidad);
            const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));
            return diffDays <= expiringThresholdDays;
        });

        setLowStockAlerts(low);
        setExpiringAlerts(exp);
        setShowLowStockAlert(low.length > 0);
        setShowExpiringAlert(exp.length > 0);
    }, [listaInventario]);*/

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

    //funcion para establecer un nuevo estado de acuerdo a la evaluacion de fecha de caducidad o stock que se establecio para las alertas
    //fecha actual <=  fecha de caducidad -> 'caducado'
    //fecha actual >  fecha de caducidad por poco-> 'pronto a caducar'
    //cantidad actual <= cantidad minima -> 'bajo stock'
    //cantidad actual > cantidad minima -> 'en stock'
    //cantidad actual == 0 -> 'finalizado'
    const evaluarEstado = async (item) => {
        const hoy = new Date();
        //console.log("EVALUANDO ESTADO PARA ITEM: ", item);
        if (Number(item.cantidadActual) === 0) {
            await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'finalizado' });
        } else if (item.fechaCaducidad) {
            const fechaCad = new Date(item.fechaCaducidad);
            if (hoy >= fechaCad) {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'caducado' });
            } else {
                const diffDays = Math.ceil((fechaCad - hoy) / (1000 * 60 * 60 * 24));   
                if (diffDays <= 2) {
                    await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'pronto_a_caducar' });
                }
            }
        }else if (item.cantidadActual != null && item.cantidadMinima != null) {
            if (Number(item.cantidadActual) <= Number(item.cantidadMinima)) {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'bajo_stock' });
            } else {
                await api.put(`/api/inventario/${item.idInventarioProducto}`, { estado: 'en_stock' });
            }
        }
    };

    //console.log("LISTA INVENTARIO FINAL: ", listaInventario);




    return (
            <div className={styles.container}>
                {/* Encabezado */}
                <Encabezado/>

                {/* Non-blocking alert boxes (keeps existing styles) */}
                <div style={{ padding: '0 20px' }}>
                    {showLowStockAlert && lowStockAlerts.length > 0 && (
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
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
                        <div className={styles.mensaje} role="status" aria-live="polite" style={{ marginBottom: 12 }}>
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
            <div className={styles.content}>
                <div className={styles.encabezadoTabla}>
                    <h2 className={styles.tituloSeccion}>Inventario Actual</h2>   
                    <button 
                        className={styles.botonAgregar} 
                        onClick={() => navigate('/actualizarstock')}
                    >
                        <span>+</span> Actualizar Stock
                    </button>
                </div>
                {mensaje && <div className={styles.mensaje}>{mensaje}</div>}
                
                {cargando ? (
                    <div className={styles.loading}><ClipLoader /></div>
                ) : (
                    <table className={styles.Table}>
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
                                    <td>{item.cantidadActual}</td>
                                    <td>{item.cantidadMinima}</td>
                                    <td>{item.cantidadMaxima}</td>
                                    <td>{item.nombreUnidad}</td>
                                    <td>{item.fechaIngreso ? format(new Date(item.fechaIngreso), 'dd/MM/yyyy HH:mm:ss') : ''}</td>
                                    <td>{item.fechaCaducidad ? format(new Date(item.fechaCaducidad), 'dd/MM/yyyy') : ''}</td>
                                    <td>{item.username}</td>
                                    <td><span className={styles[`estado_${item.estado}`]}>{item.estado}</span></td>
                                    <td className={styles.acciones}>
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
                )}
                {/*Botón de volver al panel*/}
                <button className={stylesCommon.backBtn} onClick={() => navigate('/PanelGerente')}>
                    Volver al Inicio
                </button>
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
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default VistaInventario;
