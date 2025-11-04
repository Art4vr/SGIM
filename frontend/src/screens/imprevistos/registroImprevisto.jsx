import React, { useState, useEffect, useRef} from 'react';
import { ClipLoader } from 'react-spinners';  // Si usas react-spinners
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductos, getUnidades } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';
import styles from '../../styles/auth/Register.module.css'; // Asegúrate que este archivo existe

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
    const [medidaInventario, setMedidaInventario] = useState('');//unidad de medida equivalente al inventario de dicho producto
    const [message, setMessage] = useState('');//variable de mensajes de error
    const [inventario, setInventario] = useState('');//objeto del inventario correspondiente al producto seleccionado

    const [selectedProductId, setSelectedProductId] = useState('');
    const [cantidadConvertida, setCantidadConvertida] = useState(0.0);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

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

        //Busca el objeto de medida correspondiente al inventario de dicho producto seleccionado
        const medidaSeleccionadaInventario = inventarioSeleccionado ? medidas.find(m => m.idUnidadMedida === inventarioSeleccionado.UnidadMedida_idUnidadMedida) || null : null;

        if (inventarioSeleccionado) {
            setInventario(inventarioSeleccionado);
            setMedidaProducto(medidaSeleccionadaProductos);
            setMedidaInventario(medidaSeleccionadaInventario);
        } else {
            setInventario('');
            setMedidaProducto('');
            setMedidaInventario('');
        }
    };

    // Add cantidad validation
    const handleCantidadChange = (e) => {
        const value = e.target.value;
        setCantidad(value);

        if (!value || !medidaProducto?.factorConversion) {
            setCantidadConvertida(0);
            return;
        }

        //hay que hacer una conversion de cantidad
        //actualmente se usa la cantidad correspondiente a la tabla inventarioProducto
        //entonces se hace una conversion respecto a la unidad de medida del producto hacia la unidad de medida correspondiente en inventarioProducto
        //se usa la columna factorConversion y medidaEquivalente (ej. 'Kilogramo') de la tabla unidadMedida para hacer la conversion
        //en el caso de medida equivalente habria que mapear medidas de nuevo

        //ej. cantidad del producto -> gramo | se convierte a kilogramo | multiplica por factorConversion -> 0.001

        //unidad de medida: gramo           100                  0.001
        const cantidadConv = (Number(value) * Number(medidaProducto.factorConversion))
        setCantidadConvertida(cantidadConv);

        if (inventario?.cantidadActual !== null && Number(cantidadConv) > inventario.cantidadActual) {
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
            console.log("cantidad enviada a inventario: ", inventario.cantidadActual, " - ", cantidadConvertida);
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
                    cantidadActual: (inventario.cantidadActual ?? 0) - Number(cantidadConvertida)
                });

                setTimeout(() => navigate('/PanelChef'), 750);
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
            <div className={stylesCommon.header}>
                <button
                    ref={botonRef}
                    className={stylesCommon.menuBoton}
                    onClick={toggleMenu}
                >
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi</h1>
                <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

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

            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Registrar Imprevisto</h2>
                    <form onSubmit={handleRegister}>
                        <div className={styles.inputContainer}>
                            <h4>Usuario que Reporta: {user.username}</h4>
                        </div>

                        <div className={styles.inputContainer}>
                            <h4>Producto:</h4>
                            <select
                                value={selectedProductId}
                                onChange={handleProductoChange}
                                required
                                className={errors.producto ? styles.errorInput : ''}
                            >
                                <option value="">Selecciona un producto</option>
                                {productos.map((p) => (
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
                                min="0.01"
                                step="0.01"
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

                        <button
                            className={styles.loginBtn}
                            type="button"
                            onClick={() => navigate('/PanelChef')}
                        >
                            VOLVER AL INICIO
                        </button>

                        {message && <p className={stylesCommon.message}>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroImprevisto;