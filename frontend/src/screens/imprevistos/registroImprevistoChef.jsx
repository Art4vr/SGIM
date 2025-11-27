import React, { useState, useEffect, useRef} from 'react';
import { ClipLoader } from 'react-spinners';  // Si usas react-spinners
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductos, getUnidades } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common2.module.css';
import styles from '../../styles/auth/Register.module.css';
import Encabezado from '../../components/Encabezado';

const RegistroImprevisto = () => {
    const { logout, user, loading } = useAuth();
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [productos, setProductos] = useState([]);//lista de todos los productos 
    const [inventarios, setInventarios] = useState([]);//lista de todos los inventarios
    const [medidas, setMedidas] = useState([]);//lista de todas las medidas
    const [descripcion, setDescripcion] = useState('');//descripcion que agrega el usuario sobre el imprevisto
    const [cantidad, setCantidad] = useState('');//cantidad ingresada
    const [medidaProducto, setMedidaProducto] = useState('');//unidad de medida equivalente al producto seleccionado
    const [message, setMessage] = useState('');//variable de mensajes de error
    const [inventario, setInventario] = useState('');//objeto del inventario correspondiente al producto seleccionado

    const [selectedProductId, setSelectedProductId] = useState('');

    // Cargar productos e inventario
    const cargarDatos = async () => {
        setCargando(true);
        try {
             // Obteniendo los productos (tabla Producto)
            const productosRes = await getProductos();
            setProductos(productosRes.data || []);
             // Obteniendo los lotes de productos en inventario (tabla InventarioProducto)
            const inventariosRes = await api.get('/api/inventario');
            setInventarios(inventariosRes.data?.resultados || []);

            //Obteniendo las unidades de medida disponibles (tabla UnidadMedida)
            const medidasRes = await getUnidades(); // Llamada a la ruta de medidas
            setMedidas(medidasRes.data || []);

        } catch (err) {
            setMessage('Error al cargar datos' + (err.response?.data?.mensaje || err.message));
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const productosConStock = productos.filter(p => {
        const inventarioProducto = inventarios.find(i => i.Producto_idProducto === p.idProducto);
        return inventarioProducto && inventarioProducto.cantidadActual > 0;
    })

    const handleProductoChange = (e) => {
        // Recibe el id del producto seleccionado
        const idProductoSeleccionado = Number(e.target.value);
        setSelectedProductId(e.target.value); // Set the selected product ID
        setErrors({});
        
        // Buscar el objeto de inventario correspondiente al id del producto seleccionado
        const inventarioSeleccionado = inventarios.find(i => i.Producto_idProducto === idProductoSeleccionado) || null;

        //Busca el objeto del producto correspondiente al id del producto seleccionado
        const productoSeleccionado = productos.find(p => p.idProducto === idProductoSeleccionado) || null;

        //Busca el objeto de medida correspondiente a la medida del producto seleccionado
        const medidaSeleccionadaProductos = productoSeleccionado ? medidas.find(m => m.medida === productoSeleccionado.unidad) || null : null;
        //console.log("inventario seleccionado: ", inventarioSeleccionado);
        //console.log("producto seleccionado: ", productoSeleccionado);
        
        if (inventarioSeleccionado) {
            setInventario(inventarioSeleccionado);
            setMedidaProducto(medidaSeleccionadaProductos);
        } else {
            setInventario('');
            setMedidaProducto('');
        }
    };

    // Add cantidad validation
    const handleCantidadChange = (e) => {
        const value = e.target.value;
        setCantidad(value);

        if (!value ) {
            setCantidad(0);
            return;
        }

        if (inventario?.cantidadActual !== null && Number(cantidad) > inventario.cantidadActual) {
            setErrors({
                ...errors,
                cantidad: `La cantidad no puede superar el inventario disponible (${inventario.cantidadActual})`
            });
        } else if (Number(value) <= 0) {
            setErrors({
                ...errors,
                cantidad: 'La cantidad debe ser mayor a 0'
            });
        } else {
            setErrors({
                ...errors,
                cantidad: null
            });
        }
    };

    // Manejo de registro de imprevisto
    const handleRegister = async (e) => {
        e.preventDefault();

        //Validaciones
        const newErrors = {};
        if (!inventario?.idInventarioProducto) newErrors.producto = 'Debe seleccionar un producto';
        if (!cantidad) newErrors.cantidad = 'Debe ingresar una cantidad';
        if (!descripcion.trim()) newErrors.descripcion = 'Debe ingresar una descripción';
        

        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setCargando(true);
        setTimeout(async () => {
            console.log("cantidad enviada a imprevistos: ", cantidad);
            console.log("cantidad enviada a inventario: ", inventario.cantidadActual, " - ", cantidad);
            try {
                const response = await api.post('/api/imprevistos/crear', {
                    idUsuarioReporta: user.id,
                    idInventarioProducto: inventario.idInventarioProducto,
                    descripcion,
                    cantidad: Number(cantidad),
                    idUnidadMedida: medidaProducto?.idUnidadMedida ?? null,
                });
            
                setMessage('Imprevisto registrado con éxito');
                // Actualizar el inventario después de registrar el imprevisto
                await api.put(`/api/inventario/${inventario.idInventarioProducto}`, {
                    cantidadActual: (inventario.cantidadActual ?? 0) - Number(cantidad)
                });

                setTimeout(() => user.rol === 3 ? navigate('/PanelChef') : navigate('/PanelEncargado'), 750);
            } catch (err) {
                setMessage(err.response?.data?.mensaje || err.message || 'Error al registrar imprevisto-front');
            } finally {
                setCargando(false);  // Restaura el botón después de la solicitud
            }
        }, 300);  // Retraso de 2 segundos
    };


    if (loading) {
        return <div>Cargando usuario...</div>;
    }
    
    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>

            {/* Cuerpo principal */}
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Registrar Imprevisto</h2>
                    <form onSubmit={handleRegister}>
                        

                        <div className={styles.inputContainer}>
                            <h4>Producto:</h4>
                            <select
                                value={selectedProductId}
                                onChange={handleProductoChange}
                                required
                                className={errors.producto ? styles.errorInput : ''}
                            >
                                <option value="">Selecciona un producto</option>
                                {productosConStock.map((p) => (
                                    <option key={p.idProducto} value={p.idProducto}>
                                        {p.nombre} {inventarios.find(i => i.Producto_idProducto === p.idProducto)?.cantidadActual 
                                            ? `(Disponible: ${inventarios.find(i => i.Producto_idProducto === p.idProducto).cantidadActual})` 
                                            : '(Sin stock)'}
                                    </option>
                                ))}
                            </select>
                            {errors.producto && <span className={styles.errorText}>{errors.producto}</span>}
                        </div>

                        <div className={styles.inputContainer}>
                            <label>Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>Cantidad *</label>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={handleCantidadChange}
                                required
                                min="1.0"
                                step="1.0"
                                className={errors.cantidad ? styles.errorInput : ''}
                            />
                            {errors.cantidad && <span className={styles.errorText}>{errors.cantidad}</span>}
                        </div>

                        <div className={styles.inputContainer}>
                            <h4>Unidad de Medida: {medidaProducto.abreviatura}</h4>
                        </div>

                        <button className={styles.registerBtn} type="submit" disabled={cargando}>
                            {cargando ? <ClipLoader size={20} color="#fff" /> : 'REGISTRAR IMPREVISTO'}
                        </button>

                        {/*Botón de volver al panel*/}
                        {user.rol === 3 && (
                            <button className={stylesCommon.BtnForm} onClick={() => navigate('/panelChef')}>
                                VOLVER AL INICIO
                            </button>
                        )}
                        {user.rol === 2 && (
                            <button className={stylesCommon.BtnForm} onClick={() => navigate('/PanelEncargado')}>
                                VOLVER AL INICIO
                            </button>
                        )}

                        {message && <p className={stylesCommon.message}>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroImprevisto;