//Vista general del inventario
//Muestra una tabla con el inventario de productos con sus respectivos lotes
//En caso de que haya mas de un inventario por producto, ordenara primero los que tengan la fecha de ingreso (fechaIngreso) más antigua

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

const VistaInventario = () => {
    const { logout, loading, user } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [listaInventario, setListaInventario] = useState([]);
    const [medidas, setMedidas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

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
            const producto = productos.find((p) => p.idProducto === inventario.Producto_idProducto);
            const unidadMedida = medidas.find((m) => m.idUnidadMedida === inventario.UnidadMedida_idUnidadMedida);// aqui se busca la unidad de medida del producto
            const proveedor = proveedores.find((pr) => pr.idProveedor === inventario.Proveedor_idProveedor); // aqui se busca el proveedor del inventario
            const usuario = usuarios.find((u) => u.idUsuario === inventario.Usuario_idUsuario); // aqui se busca el usuario que registro el inventario
            return {// se devuelve un nuevo objeto con los datos del inventario y los nombres de producto y unidad
                ...inventario,
                nombreProducto: producto ? producto.nombre : 'Desconocido',
                nombreUnidad: unidadMedida ? unidadMedida.abreviatura : 'Desconocida',
                nombreProveedor: proveedor ? proveedor.nombre : 'Desconocido',
                username: usuario ? usuario.username : 'Desconocido'
            };
        });
        setListaInventario(lista);
    }, [inventarios, productos, medidas, proveedores, usuarios]);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    if (loading) {
        return <div className={styles.loading}><ClipLoader /></div>;
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={stylesCommon.header}>
                <button className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Inventario de Productos</h1>
                <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Sidebar Menu */}
            <div className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/PanelAdmin')}>Panel Principal</li>
                    <li onClick={handleLogout}>Cerrar Sesión</li>
                </ul>
            </div>
            {/* Main Content */}
            <div className={styles.content}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default VistaInventario;
