import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/auth/Register.module.css';
import { getProductos, getInventarioProducto } from '../../api/productoApi'; // Aquí llamas al API de inventarioProducto

const RegistroImprevisto = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [medidas, setMedidas] = useState([]);
    const { user, loading } = useAuth();
    const [idInventarioProducto, setIdInventarioProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [idUnidadMedida, setIdUnidadMedida] = useState('');
    const [message, setMessage] = useState('');
    const [unidadMedidaProducto, setUnidadMedidaProducto] = useState('');

    // Cargar productos e inventario
    const cargarDatos = async () => {
        setCargando(true);
        try {
            const productosRes = await getProductos(); // Obtén los productos
            setProductos(productosRes.data);
            const inventariosRes = await getInventarioProducto(); // Obtén el inventario
            setInventarios(inventariosRes.data);
        } catch (err) {
            setMensaje('Error al cargar datos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleProductoChange = (e) => {
        const idProductoSeleccionado = e.target.value;
        setIdInventarioProducto(idProductoSeleccionado);

        // Buscar el producto seleccionado
        const productoSeleccionado = productos.find(p => p.idProducto === idProductoSeleccionado);
        const inventarioSeleccionado = inventarios.find(i => i.idProducto === idProductoSeleccionado);

        if (productoSeleccionado && inventarioSeleccionado) {
            setUnidadMedidaProducto(productoSeleccionado.unidadMedida); // Unidad de medida desde productos (cocina)
            setIdUnidadMedida(inventarioSeleccionado.idUnidadMedida); // Unidad de medida desde inventarioProducto (registro)
        } else {
            setUnidadMedidaProducto(''); // Si no se encuentra el producto, limpia el estado
            setIdUnidadMedida('');
        }
    };

    // Manejo de registro de imprevisto
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!idInventarioProducto || !cantidad || !descripcion) {
            setMessage('Los campos con * son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('/api/imprevistos/crear', {
                idUsuarioReporta: user.id,
                idInventarioProducto,
                descripcion,
                cantidad,
                idUnidadMedida,
            });

            setMessage('Imprevisto registrado con éxito');
            setTimeout(() => navigate('/PanelChef'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.mensaje || 'Error al registrar imprevisto');
        }
    };

    if (loading) {
        return <div>Cargando usuario...</div>;
    }

    return (
        <div className={styles.bodyContainer} style={{ backgroundImage: 'url(/imagenes/FondoMK.PNG)' }}>
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
                            >
                                <option value="">Selecciona un producto</option>
                                {productos.map((p) => (
                                    <option key={p.idProducto} value={p.idProducto}>
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>
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
                                onChange={(e) => setCantidad(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <h4>Unidad de Medida: {unidadMedidaProducto}</h4>
                        </div>

                        <button className={styles.registerBtn} type="submit">
                            REGISTRAR IMPREVISTO
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
