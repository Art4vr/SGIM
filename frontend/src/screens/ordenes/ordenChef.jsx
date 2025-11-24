import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/ordenes/ordenChef.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import { getPlatillosChef, actualizarPlatilloChef } from '../../api/chefApi';
import Encabezado from '../../components/Encabezado';

const OrdenChef = () => {
    const navigate = useNavigate();

    const [platillos, setPlatillos] = useState([]);
    
    const cargarPlatillos = async () => {
        try {
        const res = await getPlatillosChef();
        setPlatillos(res.data);
        } catch (error) {
        console.error("Error al cargar platillos:", error);
        }
    };

    useEffect(() => {
        cargarPlatillos();
        const interval = setInterval(cargarPlatillos, 5000); // Auto-refresh cada 5s
        return () => clearInterval(interval);
    }, []);

    const cambiarEstado = async (platillo, nuevoEstado) => {
        try {
        await actualizarPlatilloChef({
            idPlatilloOrden: platillo.idPlatilloOrden,
            estado: nuevoEstado
        });
        await cargarPlatillos();
        } catch (error) {
        console.error('Error al actualizar estado del platillo:', error);
        }
    };

    return(
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>

            {/* Contenido principal */}
            <div className={styles.contenidoPrincipal}>
                <h2 className={styles.tituloSeccion}>ÓRDENES EN COCINA</h2>

                {platillos.length === 0 ? (
                    <p className={styles.noPedidos}>No hay platillos pendientes en cocina</p>
                ) : (
                    <div className={styles.seccionTabla}>
                        <table className={styles.tabla}>
                            <thead>
                                <tr>
                                    <th>Orden</th>
                                    <th>Platillo</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {platillos.map((p, index) => (
                                    <tr key={index}>
                                        <td>#{p.Orden_idOrden}</td>
                                        <td>{p.platillo}</td>
                                        <td>{p.cantidad}</td>
                                        <td className={styles[`estado_${p.estado}`]}>
                                            {p.estado === 'preparacion' ? 'preparación' : p.estado}
                                        </td>
                                        <td>
                                            {p.estado === 'espera' && (
                                                <button
                                                    onClick={() => cambiarEstado(p, 'preparacion')}
                                                    className={styles.botonAccion}
                                                >
                                                    Iniciar Preparación
                                                </button>
                                            )}
                                            {p.estado === 'preparacion' && (
                                                <button
                                                    onClick={() => cambiarEstado(p, 'listo')}
                                                    className={styles.botonAccion}
                                                >
                                                    Marcar Listo
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <button className={styles.registerBtn} onClick={() => navigate('/PanelChef')}>
                    Volver al Inicio
                </button>
            </div>
        </div>
    );

};

export default OrdenChef;