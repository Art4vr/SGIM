import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from '../../styles/productos/producto.module.css'; // Reutilizamos los estilos
import api from '../../api/axiosConfig'; // Axios configurado con token o cookies seguras

import { getProductos } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto
//import { getInventarioProducto } from '../../api/inventario'; // Aquí llamas al API de inventarioProducto

const MostrarImprevistos = () => {
    const { logout, loading } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false); //menu lateral inicialmente oculto

    const [productos, setProductos] = useState([]);
    const [nombreProducto, setNombreProducto] = useState('');
    const [idProducto, setIdProducto] = useState('');
    const [inventarios, setInventarios] = useState([]);

    const [imprevistos, setImprevistos] = useState([]); // Lista completa de imprevistos
    const [busqueda, setBusqueda] = useState(''); // objetivo a buscar 
    const [filtro,setFiltro] = useState('');// filtro correspondiente a un atributo de la tabla imprevisto

    //const [estadoFiltro, setEstadoFiltro] = useState(''); 
    //const [productoFiltro, setProductoFiltro] = useState('');
    //const [usuarioFiltro, setUsuarioFiltro] = useState('');
    //const [fechaFiltro, setFechaFiltro] = useState('');

    
    // Cerrar sesión de forma segura
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };
    
    // Alternar visibilidad del menú lateral
    const toggleMenu = () => setMenuAbierto(!menuAbierto);

    /** 
     * Carga inicial de imprevistos desde el backend
     * Endpoint sugerido: GET /api/imprevistos/listar
     */
    const cargarImprevistos = async () => {
        setCargando(true);
        try {
            const response = await api.get('/api/imprevistos/listar');
            console.log("Resultados imprevistos: -front mostrarImprevisto-data: ", response.data);
            setImprevistos(response.data.resultados);
            setMensaje('');
        } catch (err) {
            setMensaje('Error al cargar imprevistos-cargarImprevistos');
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    // Cargar productos e inventario
    const cargarDatos = async () => {
        setCargando(true);
        try {
            const productosRes = await getProductos(); // Obtén los productos
            setProductos(productosRes.data);
            //const inventariosRes = await getInventarioProducto(); // Obtén el inventario
            //setInventarios(inventariosRes.data);
        } catch (err) {
            setMensaje('Error al cargar datos-cargarDatos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarImprevistos();
        cargarDatos();
    }, []);

    const handleNombreProducto = (e) => {
        const idProductoImprevisto = Number(e.target.value);//id de InventarioProducto registrado en el imprevisto
        setIdProducto(idProductoImprevisto);// se guarda el id de ese producto

        // Buscar el producto relacionado
        const productoInventario = inventarios.find(pi => pi.Producto_idProducto === idProductoImprevisto);//producto en tabla inventarioProducto correspondiente al idInventarioProducto en tabla imprevisto
        const ProductoEquivalente = productos.find(p => p.idProducto === idProductoImprevisto);//objeto de producto equivalente al id que hay en inventarioproducto pero desde la tabla Producto

        if (productoInventario && ProductoEquivalente) {
            setNombreProducto(ProductoEquivalente.nombre); //nombre del producto equivalente al id en tabla imprevisto
        } else {
            setNombreProducto(''); // Si no se encuentra el producto, limpia el estado
        }
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    }
    // Búsqueda por descripción o producto
    const handleBuscar = async (e) => {
        e.preventDefault();
        if (busqueda.trim() === '' && filtro.trim() === '') {
            console.log("busqueda vacia-handlebuscar ", busqueda);
            cargarImprevistos(); // Si no hay texto, muestra todos
            return;
        }

        setCargando(true);
        try {
            console.log("Ejecutando búsqueda con filtro:", filtro, "y texto:", busqueda);
            const response = await api.get('/api/imprevistos/listar',{
                params: {filtro,busqueda} // <-- forma correcta de enviar query params
            });
            setImprevistos(response.data.resultados);
            setMensaje(response.data.resultados.length === 0 ? 'No se encontraron resultados -handleBuscar' : '');
        } catch (err) {
            console.log("busqueda error catch-handlebuscar ", busqueda);
            setMensaje('Error al realizar la búsqueda-handleBuscar');
        } finally {
            console.log("finally ");
            setCargando(false);
        }
    };



    if (loading) return <div>Cargando usuario...</div>;

    return (
        <div className={styles.container}>
            {/* === Encabezado === */}
            <div className={styles.header}>
                <button className={styles.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* === Menú lateral === */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/Ordenes')}>Órdenes</li>
                    <li onClick={() => navigate('/Platillos')}>Platillos</li>
                    <li onClick={() => navigate('/RegistroImprevisto')}>Registrar Imprevisto</li>
                    <li onClick={() => navigate('/MostrarImprevistos')}>Ver Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* === Contenedor principal === */}
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h2 className={styles.title}>Lista de Imprevistos</h2>

                    {/* Barra de búsqueda */}
                    <select value={filtro} onChange={handleFiltroChange}>
                        <option value="">Seleccionar Filtro</option>
                        <option value="estado">Estado</option>
                        <option value="fecha">Fecha de Registro</option>
                        <option value="InventarioProducto_idInventarioProducto">Producto</option>
                        <option value="Usuario_idUsuarioReporta">Usuario que Reportó</option>
                        <option value="Usuario_idUsuarioAutoriza">Usuario que Autorizó</option>
                    </select>

                    <form onSubmit={handleBuscar} className={styles.inputContainer}>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className={styles.inputText}
                        />
                        <button type="submit" className={styles.registerBtn} disabled={cargando}>
                            {cargando ? <ClipLoader size={18} color="#fff" /> : 'Buscar'}
                        </button>
                    </form>

                    {mensaje && <p className={styles.message}>{mensaje}</p>}

                    {/* Tabla de resultados */}
                    <div className={styles.tablaContainer}>
                        {cargando ? (
                            <ClipLoader size={30} color="#000" />
                        ) : (
                            <table className={styles.tabla} style={{ width: '75%' }}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Reportado por</th>
                                        <th>Producto</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Aprobado por</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {imprevistos.length > 0 ? (
                                        imprevistos.map((imp) => (
                                            <tr key={imp.idImprevisto}>
                                                <td>{imp.idImprevisto}</td>
                                                <td>{imp.Usuario_idUsuarioReporta}</td>
                                                <td>{imp.InventarioProducto_idInventarioProducto}</td>
                                                <td>{imp.descripcion}</td>
                                                <td>{imp.cantidad}</td>
                                                <td>{imp.UnidadMedida_idUnidadMedida}</td>
                                                <td>{imp.Usuario_idUsuarioAutoriza}</td>
                                                <td>{format(new Date(imp.fecha), 'dd/MM/yyyy HH:mm:ss')}</td>
                                                <td>{imp.estado}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' }}>
                                                No hay imprevistos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Botón para regresar */}
                    <button
                        className={styles.loginBtn}
                        onClick={() => navigate('/PanelChef')}
                    >
                        VOLVER AL INICIO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MostrarImprevistos;
