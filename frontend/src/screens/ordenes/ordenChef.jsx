import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/ordenes/ordenChef.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import PerfilUsuario from '../../components/PerfilUsuario';
import { getPlatillosChef, actualizarPlatilloChef } from '../../api/chefApi';

const OrdenChef = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const [platillos, setPlatillos] = useState([]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
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
            <div className={stylesCommon.header}>
                <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                {/* ESTA ES LA PARTE CLAVE (Derecha) */}
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" /> {}
                </div>
            </div>

            {/* Menú lateral */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/ordenChef')}>Órdenes</li>
                    <li onClick={() => navigate('/platillosChef')}>Platillos</li>
                    <li onClick={() => navigate('/RegistroImprevisto')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenidoPrincipal}>
                <h2 className={styles.tituloSeccion}>Órdenes en Cocina</h2>

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
                                        <td className={styles[`estado_${p.estado}`]}>{p.estado}</td>
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
            </div>
        </div>
    );

};

export default OrdenChef;