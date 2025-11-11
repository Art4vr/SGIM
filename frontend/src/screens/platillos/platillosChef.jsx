import api from '../../api/axiosConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/platillos/PlatillosChef.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import PerfilUsuario from '../../components/PerfilUsuario';

const PlatillosChef = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

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
                </ul>
            </div>

        </div>
    );
};

export default PlatillosChef;