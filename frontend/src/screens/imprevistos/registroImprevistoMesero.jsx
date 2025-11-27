import React, { useState, useEffect, useRef} from 'react';
import { ClipLoader } from 'react-spinners';  // Si usas react-spinners
import { useNavigate } from 'react-router-dom';
import { getPlatillos } from '../../api/platilloApi';
import { useAuth } from '../../context/AuthContext';
import { getProductos, getUnidades } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';
import styles from '../../styles/auth/Register.module.css'; // Asegúrate que este archivo existe
import { getPlatillosChef, actualizarPlatilloChef } from '../../api/chefApi';
import Encabezado from "../../components/Encabezado";

import PerfilUsuario from '../../components/PerfilUsuario';


const RegistroImprevistoMesero = () => {
    const { logout, user, loading } = useAuth();
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const [productos, setProductos] = useState([]);//lista de todos los productos 
    const [ingredientes, setIngredientes] = useState([]);//lista de todos los ingredientes
    const [platillos, setPlatillos] = useState([]);//lista de todos los platillos
    const [productosPlatillo, setProductosPlatillo] = useState([]);//lista de todos los productos por platillo (recetas)
    const [platillosOrden, setPlatillosOrden] = useState([]);//lista de todos los platillos en la orden actual
    const [inventarios, setInventarios] = useState([]);//lista de todos los inventarios
    const [medidas, setMedidas] = useState([]);//lista de todas las medidas
    const [descripcion, setDescripcion] = useState('');//descripcion que agrega el usuario sobre el imprevisto
    const [cantidad, setCantidad] = useState([]);//cantidad de productos
    const [cantidadPlatillo, setCantidadPlatillo] = useState('');//cantidad  de platillo (input)
    const [medidaProducto, setMedidaProducto] = useState([]);//unidad de medida equivalente al producto seleccionado
    const [medidaInventario, setMedidaInventario] = useState([]);//unidad de medida equivalente al inventario de dicho producto
    const [message, setMessage] = useState('');//variable de mensajes de error
    const [inventario, setInventario] = useState([]);//objeto del inventario correspondiente al producto seleccionado
    

    const [selectedDishId, setSelectedDishId] = useState('');
    const [selectedDish, setSelectedDish] = useState('');
    const [cantidadConvertida, setCantidadConvertida] = useState([]);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    // Cargar datos inciales como: platillos, productos, inventarios, medidas
    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [productosRes, platillosRes, medidasRes, inventariosRes, platillosOrdenRes] = await Promise.all([
                getProductos(),
                getPlatillos(),
                getUnidades(),
                api.get('/api/inventario'),
                api.get(`/api/ordenes/mesero/${user?.id}/platillos`)
            ]);
            setPlatillosOrden(platillosOrdenRes.data || []);
            //console.log("platillos orden cargados: ", platillosOrdenRes.data);
            setProductos(productosRes.data || []);
            setPlatillos(platillosRes.data || []);
            setMedidas(medidasRes.data || []);
            setInventarios(inventariosRes.data?.resultados || []);
        } catch (err) {
            setMessage('Error al cargar datos' + (err.response?.data?.mensaje || err.message));
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
        };

    const handleLogout = async () => {
        try {
            await logout(); // Esto hace POST /logout, limpia user y localStorage
            navigate('/'); // Redirige al login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    useEffect(() => { 
        const handleClickOutside = (event) =>{
            if(
                menuAbierto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                botonRef.current &&
                !botonRef.current.contains(event.target)
            ){
                setMenuAbierto(false);
            }
        }

        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    }, [menuAbierto]);


    //-------------------- elección de platillos ------------------------

    const handlePlatilloChange = async (e) => {
        
        // Recibe el id del platillo seleccionado
        const idPlatilloSeleccionado = platillosOrden.find(pl => pl.idPlatilloOrden === Number(e.target.value))?.idPlatillo;
        //console.log("resultado del select: ", e.target.value);
        //console.log("platillosOrden: ", platillosOrden);
        //console.log("idPlatilloSeleccionado: ", idPlatilloSeleccionado);
        const platilloSel = platillosOrden.find(pl => pl.idPlatilloOrden === Number(e.target.value));
        setSelectedDishId(Number(e.target.value)); // Set the selected product ID
        //console.log("setSelectedDishId: ", Number(e.target.value))
        setSelectedDish(platilloSel); // Set the selected product object
        setErrors({});
        
        const productosPlatilloRes = await api.get(`/api/productosPlatillo/obtener/${idPlatilloSeleccionado}`);
        //idPlatillo, idProducto, idUnidadMedida, cantidad
    
        const ingredientesPlatillo = productosPlatilloRes.data.resultados;
        //console.log("ingredientes platillo seleccionado: ", ingredientesPlatillo);
        //console.log("platillo seleccionado: ", platilloSel);

        //hacer un foreach para que el proceso de descuento de inventario se haga por cada ingrediente que forma parte del platillo
        setProductosPlatillo(ingredientesPlatillo || []);
        ingredientesPlatillo.forEach(producto => {
            //console.log("producto platillo seleccionado: ", producto);
            // Buscar el objeto de inventario correspondiente al id del producto seleccionado
            const inventarioSeleccionado = inventarios.find(i => i.Producto_idProducto === producto.Producto_idProducto) || null;
            //console.log("inventarioSeleccionado: ", inventarioSeleccionado);

            //Busca el objeto del producto correspondiente al id del producto seleccionado
            const productoSeleccionado = productos.find(p => p.idProducto === producto.Producto_idProducto) || null;
            //console.log("productoSeleccionado: ", productoSeleccionado);
            //Busca el objeto de medida correspondiente a la medida del producto seleccionado
            const medidaSeleccionadaProductos = productoSeleccionado ? medidas.find(m => m.medida === productoSeleccionado.unidad) || null : null;
            //console.log("medidaSeleccionadaProductos: ", medidaSeleccionadaProductos);
            //console.log("inventario seleccionado: ", inventarioSeleccionado);
            //console.log("producto seleccionado: ", productoSeleccionado);

            //Busca el objeto de medida correspondiente al inventario de dicho producto seleccionado
            const medidaSeleccionadaInventario = inventarioSeleccionado ? medidas.find(m => m.idUnidadMedida === inventarioSeleccionado.UnidadMedida_idUnidadMedida) || null : null;

            if (inventarioSeleccionado) {
                //como ahora son un array se van añadiendo
                setCantidad(prev => [...prev, producto.cantidad]);
                setInventario(prev => [...prev, inventarioSeleccionado]);
                setMedidaProducto(prev => [...prev, medidaSeleccionadaProductos]);
                setMedidaInventario(prev => [...prev, medidaSeleccionadaInventario]);
            } else {
                setInventario([]);
                setMedidaProducto([]);
                setMedidaInventario([]);
                setCantidad([]);
            }
        });
        //console.log("inventario para imprevisto: ", inventario);
        //console.log("medida producto para imprevisto: ", medidaProducto);
        //console.log("medida inventario para imprevisto: ", medidaInventario);
        //console.log("cantidad para imprevisto: ", cantidad);
    };

    // Cantidad de platillos involucrados en el imprevisto
    const handleCantidadChange = (e) => {
        //console.log("selectedDish: ", selectedDish);
        const value = e.target.value;
        setCantidadPlatillo(value);
        //console.log("Dentro de candidad change - value cantidad platillo", value);

        if (!value) {
            setCantidadConvertida([]);
            return;
        }
        //console.log("selectedDish ID: ", selectedDishId);
        //console.log("selectedDish: ", selectedDish);
        if ( selectedDish.cantidad !== null && Number(value) > Number(selectedDish.cantidad)) {
            //console.log("if de cantidades");
            setErrors({
                ...errors,
                cantidad: `La cantidad no puede ser mayor a los platillos ordenados (${selectedDish.cantidad})`
            });
        } else if (Number(value) <= 0) {
            //console.log("else if de cantidades");
            setErrors({
                ...errors,
                cantidad: 'La cantidad debe ser mayor a 0'
            });
        } else {
            //console.log("else de cantidades");
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
        if (inventario.length === 0) newErrors.producto = 'Debe seleccionar un producto';
        if (!cantidadPlatillo) newErrors.cantidad = 'Debe ingresar una cantidad';
        if (!descripcion.trim()) newErrors.descripcion = 'Debe ingresar una descripción';
        

        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        //establecer el estado del platillo en la orden a 'preparacion'
        try {
            const response = await actualizarPlatilloChef({
                idPlatilloOrden: selectedDish.idPlatilloOrden,
                estado: 'preparacion'
            });
            //console.log("response: ", response);
            //console.log("Estado del platillo en la orden actualizado a 'preparacion'");
        }catch (err) {
            console.error('Error al actualizar estado del platillo en la orden:', err);
        }
        


        //hacer una insercion de imprevistos por cada producto del platillo usando selectedDish, la descripcion será la misma para todos los ingredientes
        
        setCargando(true);
        //setTimeout(async () => {
            productosPlatillo.forEach( async (productoPlatillo, index) => {
                
                try {
                    const cantidadNecesaria = productoPlatillo.cantidad * Number(cantidadPlatillo);
                    //console.log("cantidad enviada a imprevistos: ", cantidadNecesaria);
                    //console.log("cantidad enviada a inventario: ", inventario[index].cantidadActual, " - ", cantidadNecesaria);
                    //
                    //console.log("cantidad necesaria del producto para el imprevisto: ", cantidadNecesaria);
                    const response = await api.post('/api/imprevistos/crear', {
                        idUsuarioReporta: user.id,
                        idInventarioProducto: inventarios.find(i => i.Producto_idProducto === productoPlatillo.Producto_idProducto)?.idInventarioProducto,
                        descripcion,
                        //conversion de cantidadnecesria por factor de conversion
                        cantidad: cantidadNecesaria,
                        idUnidadMedida: medidaProducto[index]?.idUnidadMedida ?? null,
                    });
                    setMessage('Imprevisto registrado con éxito');
                    // Actualizar el inventario después de registrar el imprevisto
                    await api.put(`/api/inventario/${inventario[index].idInventarioProducto}`, {
                        cantidadActual: (inventario[index].cantidadActual ?? 0) - Number(cantidadNecesaria)
                    });
                    setTimeout(() => navigate('/PanelGerente'), 750);
                } catch (err) {
                    console.error('Error al registrar imprevisto para producto:', productoPlatillo.Producto_idProducto, err);
                }
            });
        //}, 300);  // Retraso de 2 segundos
    };


    if (loading) {
        return <div>Cargando usuario...</div>;
    }
    
    return (
        <div className={styles.container}>
            
            {/* Encabezado */}
            <Encabezado/>


            {/* Menú lateral */}
            <div
                ref={menuRef} 
                className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}
            >
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/ordenChef')}>Órdenes</li>
                    <li onClick={() => navigate('/platillosChef')}>Platillos</li>
                    <li onClick={() => navigate('/RegistroImprevisto')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>
            <div className={`${styles.registerContainer} ${menuAbierto ? stylesCommon.conMenuAbierto : ''}`}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Registrar Imprevisto</h2>
                    <form onSubmit={handleRegister}>
                        <div className={styles.inputContainer}>
                            <h4>Usuario que Reporta: {user.username}</h4>
                        </div>

                        <div className={styles.inputContainer}>
                            <h4>Platillo:</h4>
                            <select
                                value={selectedDishId}
                                onChange={handlePlatilloChange}
                                required
                                className={errors.producto ? styles.errorInput : ''}
                            >
                                <option value="">Selecciona un platillo</option>
                                {platillosOrden.map((pl) => (
                                    <option key={pl.idPlatilloOrden} value={pl.idPlatilloOrden}>
                                        {pl.platillo}
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
                                value={cantidadPlatillo}
                                onChange={handleCantidadChange}
                                required
                                min="1"
                                step="1"
                                className={errors.cantidad ? styles.errorInput : ''}
                            />
                            {errors.cantidad && <span className={styles.errorText}>{errors.cantidad}</span>}
                        </div>

                        <button className={styles.registerBtn} type="submit" disabled={cargando}>
                            {cargando ? <ClipLoader size={20} color="#fff" /> : 'REGISTRAR IMPREVISTO'}
                        </button>
                        
                        {user?.rol === 3 &&(
                            <button
                                className={styles.loginBtn}
                                type="button"
                                onClick={() => navigate('/PanelChef')}
                            >
                                VOLVER AL INICIO
                            </button>
                        )}

                        {user?.rol === 4 &&(
                            <button
                                className={styles.loginBtn}
                                type="button"
                                onClick={() => navigate('/PanelMesero')}
                            >
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

export default RegistroImprevistoMesero;