import React, { useState, useEffect, useRef} from 'react';
import { ClipLoader } from 'react-spinners';  // Si usas react-spinners
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductos, getInventarioProducto } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';
import styles from '../../styles/auth/Register.module.css'; // Asegúrate que este archivo existe

const RegistroImprevisto = () => {
    const { logout, user, loading } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [inventarioDisponible, setInventarioDisponible] = useState(null);

    const [productos, setProductos] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [idInventarioProducto, setIdInventarioProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [medidaProducto, setMedidaProducto] = useState('');
    const [idUnidadMedida, setIdUnidadMedida] = useState('');
    const [message, setMessage] = useState('');
    const [idInventario, setIdInventario] = useState('');

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
            setInventarios(inventariosRes.data.resultados || []);

            //Obteniendo las unidades de medida disponibles (tabla UnidadMedida)
            const medidasRes = await api.get('/api/unidades'); // Llamada a la ruta de medidas
            setMedidas(medidasRes.data);
        } catch (err) {
            setMensaje('Error al cargar datos' + (err.response?.data?.mensaje || err.message));
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

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
        const idProductoSeleccionado = Number(e.target.value);
        setIdInventarioProducto(idProductoSeleccionado);
        setErrors({});
        
        // Buscar el producto seleccionado
        const inventarioSeleccionado = inventarios.find(
            i => i.Producto_idProducto === idProductoSeleccionado
        );

        const medidaSeleccionada = medidas.find(
            m => m.idUnidadMedida === inventarioSeleccionado.UnidadMedida_idUnidadMedida 
        );

        if (inventarioSeleccionado) {
            setIdInventario(inventarioSeleccionado.idInventarioProducto);
            setInventarioDisponible(inventarioSeleccionado.cantidadActual);
            setMedidaProducto(medidaSeleccionada.abreviatura);
            setIdUnidadMedida(medidaSeleccionada.idUnidadMedida);
        } else {
            setInventarioDisponible(null);
            setMedidaProducto('');
            setIdUnidadMedida('');
        }
    };

    // Add cantidad validation
    const handleCantidadChange = (e) => {
        const value = e.target.value;
        setCantidad(value);
        
        if (inventarioDisponible !== null && Number(value) > inventarioDisponible) {
            setErrors({
                ...errors,
                cantidad: `La cantidad no puede superar el inventario disponible (${inventarioDisponible})`
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
        if (!idInventarioProducto) newErrors.producto = 'Debe seleccionar un producto';
        if (!cantidad) newErrors.cantidad = 'Debe ingresar una cantidad';
        if (!descripcion.trim()) newErrors.descripcion = 'Debe ingresar una descripción';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setCargando(true);
        setTimeout(async () => {
            try {
                const response = await api.post('/api/imprevistos/crear', {
                    idUsuarioReporta: user.id,
                    idInventarioProducto,
                    descripcion,
                    cantidad,
                    idUnidadMedida: idUnidadMedida,
                });
            
                setMessage('Imprevisto registrado con éxito');
                // Actualizar el inventario después de registrar el imprevisto
                await api.put(`/api/inventario/${idInventario}`, {
                    cantidadActual: inventarioDisponible - Number(cantidad)
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


    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Menú lateral */}
            <div className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/ordenChef')}>Órdenes</li>
                    <li onClick={() => navigate('/platillosChef')}>Platillos</li>
                    <li onClick={() => navigate('/Ordenes')}>Órdenes</li>
                    <li onClick={() => navigate('/Platillos')}>Platillos</li>
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
                                value={idInventarioProducto}
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
                            <h4>Unidad de Medida: {medidaProducto}</h4>
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

                        {message && <p className={styles.message}>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroImprevisto;
