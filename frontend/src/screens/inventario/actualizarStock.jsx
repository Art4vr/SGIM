//pantalla para actualizar cantidad de productos
//Añade manualmente la cantidad de producto que llegó, registra los datos que se especifican en el modelo y controlador de registrarInventario
//Escoge el producto de una lista de productos y a partir de ahi agrega los datos como la cantidad
//Escoge tambien de la lista de unidades de medida y de una de proveedores
//Ingresa fecha de caducidad, cantidad maxima y minima necesarias, asi como cantidad actual
//Jala el username del usuario que hace el registro

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from '../../styles/imprevistos/imprevistos.module.css';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';

import { getProductos, getUnidades, getCategorias } from '../../api/productoApi';
import { getProveedores } from '../../api/proveedorApi';

const ActualizarStock = () => {
    const { logout, loading, user } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [productos, setProductos] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [idProductoSeleccionado, setIdProductoSeleccionado] = useState('');
    const [cantidadAgregar, setCantidadAgregar] = useState(0);
    const [inventarioActual, setInventarioActual] = useState(null);
    const [cantidadMaxima, setCantidadMaxima] = useState(0);
    const [cantidadMinima, setCantidadMinima] = useState(0);
    const [fechaCaducidad, setFechaCaducidad] = useState('');
    const [idProveedorSeleccionado, setIdProveedorSeleccionado] = useState('');
    const [idUnidadMedidaSeleccionada, setIdUnidadMedidaSeleccionada] = useState('');

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const productosData = await getProductos();
            const unidadesData = await getUnidades();
            const categoriasData = await getCategorias();
            const proveedoresData = await getProveedores();
            
            //console.log("productos : " +  productosData.data);
            setProductos(productosData.data);
            //console.log("Unidades de medida: ",  unidadesData.data);
            setUnidades(unidadesData.data);
            //console.log("categorias: " +  categoriasData.data);
            setCategorias(categoriasData.data);
            //console.log("proveedores: " +  proveedoresData.data);
            setProveedores(proveedoresData.data);
        } catch (error) {
            setMensaje('Error al cargar los datos');
        } finally {
            setCargando(false);
        }
    };
    useEffect(() => {
        cargarDatos();
    }, []);

    const manejarActualizarStock = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');
        console.log("Unidades de medida2: ",  unidades);
        try {
            console.log("DATOS PARA QUERY: idProducto", idProductoSeleccionado, " cantidadActual: ", cantidadAgregar, " cantidadMaxima: ", cantidadMaxima, " cantidadMinima: ", cantidadMinima, " fechaCaducidad: ", fechaCaducidad, " idProveedor: ", idProveedorSeleccionado, "idUsuario", user.id, " idUnidadMedida: ", idUnidadMedidaSeleccionada);
            const response = await api.post('/api/inventario/crear', {
                Producto_idProducto: idProductoSeleccionado,
                cantidadMaxima,
                cantidadMinima,
                cantidadActual: cantidadAgregar,
                fechaCaducidad,
                Proveedor_idProveedor: idProveedorSeleccionado,
                Usuario_idUsuario: user.id,
                UnidadMedida_idUnidadMedida: idUnidadMedidaSeleccionada
            });
            setMensaje('Stock actualizado correctamente');
        } catch (error) {
            setMensaje(error.response?.data?.mensaje || error.message || 'Error al actualizar el stock');
        } finally {
            setCargando(false);
        }
    };
    return (
        <div className={styles.container}>
            <h2>Actualizar Stock de Producto</h2>
            {cargando ? (
                <ClipLoader />
            ) : (
                <form onSubmit={manejarActualizarStock} className={styles.form}>
                    <label>
                        Producto:
                        <select value={idProductoSeleccionado} onChange={(e) => setIdProductoSeleccionado(e.target.value)} required>
                            <option value="">Seleccione un producto</option>
                            {productos.map((producto) => ( 
                                <option key={producto.idProducto} value={producto.idProducto}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Cantidad a Agregar:
                        <input type="number" value={cantidadAgregar} onChange={(e) => setCantidadAgregar(e.target.value)} required />
                    </label>
                    <label>
                        Cantidad Máxima:
                        <input type="number" value={cantidadMaxima} onChange={(e) => setCantidadMaxima(e.target.value)} required />
                    </label>
                    <label>
                        Cantidad Mínima:
                        <input type="number" value={cantidadMinima} onChange={(e) => setCantidadMinima(e.target.value)} required />
                    </label>
                    <label>
                        Fecha de Caducidad:
                        <input type="date" value={fechaCaducidad} onChange={(e) => setFechaCaducidad(e.target.value)} required />
                    </label>
                    <label>
                        Proveedor:
                        <select value={idProveedorSeleccionado} onChange={(e) => setIdProveedorSeleccionado(e.target.value)} required>
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Unidad de Medida:
                        <select value={idUnidadMedidaSeleccionada} onChange={(e) => setIdUnidadMedidaSeleccionada(e.target.value)} required>
                            <option value="">Seleccione una unidad de medida</option>
                            {unidades.map((unidad) => (
                                <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                                    {unidad.abreviatura}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button type="submit">Actualizar Stock</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarStock;