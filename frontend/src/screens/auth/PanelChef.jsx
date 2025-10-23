import api from '../../api/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/platillos/Platillo.module.css';


const PanelChef = () => {
    const navigate = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
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
                    <li onClick={() => navigate('/Ordenes')}>Órdenes</li>
                    <li onClick={() => navigate('/Platillos')}>Platillos</li>
                    <li onClick={() => navigate('/RegistroImprevisto')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/Ordenes')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/ordenes.png" alt="ordenes" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Ordenes</h3>
                    </div>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/Platillos')}>
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