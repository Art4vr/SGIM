import api from '../../api/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/platillos/PlatillosChef.module.css';

const PlatillosChef = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

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

    return(
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

        </div>
    );
};

export default PlatillosChef;