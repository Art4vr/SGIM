import api from '../../api/axiosConfig';
import { useState, botonRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import PerfilUsuario from '../../components/PerfilUsuario';


const PanelMesero = () => {
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
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/OrdenesMesero')}>Ordenes Mesero</li>
                    <li onClick={() => navigate('/platillos')}>Platillos</li>
                    <li onClick={() => navigate('/VerMenu')}>Ver Menú</li>
                    <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/OrdenesMesero')}>
                    <img className={styles.imagenMenu} src="/imagenes/Orden_Mesero.png" alt="Ordenes Mesero" />
                    <h3>Ordenes Mesero</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Platillos.png" alt="Platillos" />
                    <h3>Platillos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/verMenu')}>
                    <img className={styles.imagenMenu} src="/imagenes/VerM.png" alt="Ver Menu" />
                    <h3>Ver Menu</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelMesero;