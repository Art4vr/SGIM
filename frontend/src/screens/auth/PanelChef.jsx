import api from '../../api/axiosConfig';
import { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/platillos/Platillo.module.css';
import stylesCommon from '../../styles/common/common.module.css';


const PanelChef = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout(); // Esto hace POST /logout, limpia user y localStorage
            navigate('/'); // Redirige al login
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

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Menú lateral */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/ordenChef')}>Órdenes</li>
                    <li onClick={() => navigate('/platillosChef')}>Platillos</li>
                    <li onClick={() => navigate('/RegistroImprevisto')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/ordenChef')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/ordenes.png" alt="ordenes" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Ordenes</h3>
                    </div>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillosChef')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="platillos" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Platillos</h3>
                    </div>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/RegistroImprevisto')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="imprevistos" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Imprevistos</h3>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PanelChef;