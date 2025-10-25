import api from '../../api/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/platillos/Platillo.module.css';


const PanelChef = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);

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

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={styles.header}>
                <button className={styles.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Menú lateral */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
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