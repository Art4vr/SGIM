import api from '../../api/axiosConfig';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import PerfilUsuario from '../../components/PerfilUsuario.jsx';

const PanelAdm = () => {
    const navigate = useNavigate();

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

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <div className={stylesCommon.header}>
                <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
                {/* Menú de usuario */}
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" /> {}
                </div>
            </div>

            {/* Menú lateral */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/usuarios')}>Usuarios</li>
                    <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                    <li onClick={() => navigate('/inventario')}>Inventario</li>
                    <li onClick={() => navigate('/platillos')}>Platillos</li>
                    <li onClick={() => navigate('/pedidos')}>Pedidos</li>
                    <li onClick={() => navigate('/reportes')}>Reportes</li>
                    <li onClick={() => navigate('/mesas')}>Mesas</li>
                    <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/usuarios')}>
                    <img className={styles.imagenMenu} src="/imagenes/Usuarios.png" alt="Usuarios" />
                    <h3>Usuarios</h3>
                </button>


                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3>Proveedores</h3>
                </button>


                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3>Inventario</h3>
                </button>


                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="Platillos" />
                    <h3>Platillos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/pedidos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Pedidos.png" alt="Pedidos" />
                    <h3>Pedidos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/reportes')}>
                    <img className={styles.imagenMenu} src="/imagenes/Reportes.png" alt="Reportes" />
                    <h3>Reportes</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/mesas')}>
                    <img className={styles.imagenMenu} src="/imagenes/Mesas.png" alt="Mesas" />
                    <h3>Mesas</h3>
                </button>


                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelAdm;