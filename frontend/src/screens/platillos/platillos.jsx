import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlatillos, eliminarPlatillo, getCategoriasPlatillo } from '../../api/platilloApi';
import { useNavigate } from 'react-router-dom';
import NuevoPlatillo from './nuevoPlatillo';
import api from '../../api/axiosConfig';
import stylesTabla from '../../styles/common/tablas.module.css';
import stylesCommon from '../../styles/common/common2.module.css';
import IngredientesPlatillo from './ingredientes';
import Encabezado from '../../components/Encabezado';
import AlertasInventario from '../../components/AlertasInventario';
import ModalEliminarPlatillo from "./modalEliminar";

const VistaPlatillos = () => {
    const { logout, user, loading } = useAuth();
    const navigate = useNavigate();
    const [platillos, setPlatillos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [platilloEditando, setPlatilloEditando] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [eliminandoId, setEliminandoId] = useState(null);
    const [modalAccion, setModalAccion] = useState(null);
    
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
    const [platilloAEliminar, setPlatilloAEliminar] = useState(null);

    const cargarPlatillos = async () => {
        
        setCargando(true);
        try {
            const res = await getPlatillos();
            setPlatillos(res.data);
        } catch (err) {
            setMensaje('Error al cargar platillos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const verificarDisponibilidad = async () => {
            try {
                // Hacemos una solicitud POST para verificar la disponibilidad
                const response = await api.post('/api/platillos/disponibilidad');
                
                // Si la respuesta es exitosa
                console.log(response.data.msg);  // Muestra el mensaje del backend
            } catch (error) {
                // Si ocurre un error
                console.error('Error al verificar la disponibilidad de los platillos:', error);
            }
        };
        verificarDisponibilidad();

        cargarPlatillos();
    }, []);

    const abrirModal = (platillo = null, modalAccion = null) => {
        setPlatilloEditando(platillo);
        setModalVisible(true);
        setMensaje('');
        setModalAccion(modalAccion);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setPlatilloEditando(null);
    };

const confirmarEliminar = (platillo) => {
    setPlatilloAEliminar(platillo);
    setModalEliminarVisible(true);
};

    /*const eliminar = async (id) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar este platillo?");
        if (!confirm) return;

        setEliminandoId(id);
        try {
            await eliminarPlatillo(id);
            setMensaje('Platillo eliminado correctamente');
            await cargarPlatillos();
        } catch (err) {
            setMensaje(err.response?.data?.mensaje || err.message || 'Error al eliminar platillo');
        } finally {
            setEliminandoId(null);
        }
    };*/

const handleEliminarPlatillo = async () => {
    if (!platilloAEliminar) return;

    const id = platilloAEliminar.idPlatillo;
    setEliminandoId(id);

    try {
        await eliminarPlatillo(id);
        setMensaje("Platillo eliminado correctamente");
        await cargarPlatillos();
    } catch (err) {
        console.error(err);
        setMensaje(err.response?.data?.mensaje || "Error al eliminar platillo");
    } finally {
        setEliminandoId(null);
        setModalEliminarVisible(false);
        setPlatilloAEliminar(null);
    }
};

    const [filtros, setFiltros] = useState({
        categoria: '',
        estado: '',
        precioMin: '',
        precioMax: ''
    });

    const handleFiltroChange = (e, campo) => {
        setFiltros({
            ...filtros,
            [campo]: e.target.value
        });
    };

    const platillosFiltrados = platillos.filter((p) => {
        const coincideCategoria = filtros.categoria === '' || p.categoria === filtros.categoria;
        const coincideEstado = filtros.estado === '' || p.estado === filtros.estado;

        // Lógica para el rango de precios
        const precioPlatillo = parseFloat(p.precio);
        const min = parseFloat(filtros.precioMin);
        const max = parseFloat(filtros.precioMax);

        // Si 'min' no es un número (isNaN) o el precio es mayor/igual, coincide
        const coincideMin = isNaN(min) || precioPlatillo >= min;
        // Si 'max' no es un número (isNaN) o el precio es menor/igual, coincide
        const coincideMax = isNaN(max) || precioPlatillo <= max;

        return coincideCategoria && coincideEstado && coincideMin && coincideMax;
    });

    const limpiarFiltros = () => {
        setFiltros ({
            categoria: '',
            estado: '',
            precioMin: '',
            precioMax: ''
        });
    };

    return (
        <div>
            {/* Encabezado */}
            <Encabezado/>
            
            {/* Contenido Principal */}
            <div className={stylesTabla.bodyContainer}>
                <div className={stylesTabla.tablaContainer}>
                    <div className={stylesTabla.tablaCard}>
                        <div className={stylesTabla.encabezadoTabla}>
                        <h2 className={stylesCommon.title}>GESTIÓN DE PLATILLOS</h2>

                        
                        <button className={stylesCommon.Btn} onClick={() => abrirModal(null, "nuevoPlatillo")}>
                            Agregar Platillo
                        </button>
                        </div>
                        {mensaje && <p className={stylesCommon.message}>{mensaje}</p>}
                        
                        {/* === FILTROS === */}
                        <div className={stylesCommon.filterContainer}>
                            {/* Este 'select' de categoría se queda como está */}
                            <select
                                value={filtros.categoria}
                                onChange={(e) => handleFiltroChange(e, 'categoria')}
                                className={stylesCommon.filterInput}
                            >
                                <option value="">Todas las categorías</option>
                                {[...new Set(platillos.map((p) => p.categoria))].map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {/* Este 'select' de estado se queda como está */}
                            <select
                                value={filtros.estado}
                                onChange={(e) => handleFiltroChange(e, 'estado')}
                                className={stylesCommon.filterInput}
                            >
                                <option value="">Todos los estados</option>
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="descontinuado">Descontinuado</option>
                            </select>

                            {/* --- NUEVOS INPUTS DE PRECIO --- */}
                            <input
                                type="number"
                                placeholder="Precio Mín."
                                value={filtros.precioMin}
                                onChange={(e) => handleFiltroChange(e, 'precioMin')}
                                className={stylesCommon.filterInput}
                                min="0"
                            />
                            <input
                                type="number"
                                placeholder="Precio Máx."
                                value={filtros.precioMax}
                                onChange={(e) => handleFiltroChange(e, 'precioMax')}
                                className={stylesCommon.filterInput}
                                min="0"
                            />
                        </div>
                        {/*Botón para limpiar filtros*/}
                        <button onClick={limpiarFiltros} className={stylesCommon.BtnForm}>Limpiar Filtros</button>
                        {cargando ? (
                            <p>🔄 Cargando platillos...</p>
                        ) : (
                            <div className={stylesTabla.TableWrapper}>
                                <table className={stylesTabla.Table}>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Descripcion</th>
                                            <th>Categoria</th>
                                            <th>Imagen</th>
                                            <th>Precio</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                            <th>Ingredientes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {platillosFiltrados.map((p) => (
                                            <tr key={p.idPlatillo}>
                                                <td>{p.nombre}</td>
                                                <td>{p.descripcion}</td>
                                                <td>{p.categoria}</td>
                                                <td>{p.imagen}</td>
                                                <td>{p.precio}</td>
                                                <td className={`${p.estado === 'disponible' ? stylesTabla.estadoactivo : stylesTabla.estadoinactivo}`}>{p.estado}</td>
                                                <td className={stylesCommon.BtnAcciones}>
                                                    <button onClick={() => abrirModal(p,"nuevoPlatillo")}>✏️</button>
                                                    <button
                                                        onClick={() => confirmarEliminar(p)}
                                                        disabled={eliminandoId === p.idPlatillo}
                                                    >
                                                        {eliminandoId === p.idPlatillo ? '🗑️...' : '🗑️'}
                                                    </button>
                                                </td>
                                                <td className={stylesCommon.BtnAcciones}> 
                                                    <button onClick={() => abrirModal(p,"ingredientes")}>🍽️</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {modalVisible && (
                            modalAccion === 'nuevoPlatillo' ? (
                            <NuevoPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
                        ) : (
                            <IngredientesPlatillo
                                platillo={platilloEditando}
                                onClose={cerrarModal}
                                onRefresh={cargarPlatillos}
                            />
                        )
                        )}

                        {user?.rol=== 1 && (
                        <button
                            className={stylesCommon.BtnForm}
                            type="button"
                            onClick={() => navigate('/PanelGerente')}
                            >
                            VOLVER AL INICIO
                        </button>
                        )}
                        {user?.rol=== 4 &&(
                        <button
                            className={stylesCommon.BtnForm}
                            type="button"
                            onClick={() => navigate('/PanelMesero')}
                            >
                            VOLVER AL INICIO
                        </button>
                        )}
                        {user?.rol=== 3 &&(
                        <button
                            className={stylesCommon.BtnForm}
                            type="button"
                            onClick={() => navigate('/PanelChef')}
                            >
                            VOLVER AL INICIO
                        </button>
                        )}

                        {modalEliminarVisible && (
                            <ModalEliminarPlatillo 
                                visible={modalEliminarVisible}
                                platillo={platilloAEliminar}
                                onConfirm={handleEliminarPlatillo}
                                onClose={() => setModalEliminarVisible(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default VistaPlatillos;
