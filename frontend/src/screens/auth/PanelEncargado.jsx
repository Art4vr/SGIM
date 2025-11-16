import api from '../../api/axiosConfig';
import { useState, botonRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import stylesCommon from '../../styles/common/common.module.css';


const PanelEncargado = () => {
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
                <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Menú lateral */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                    <li onClick={() => navigate('/inventario')}>Inventario</li>
                    <li onClick={() => navigate('/actualizarStock')}>Actualizar Stock</li>
                    <li onClick={() => navigate('/productos')}>Productos</li>
                    <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3>Proveedores</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3>Inventario</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/actualizarStock')}>
                    <img className={styles.imagenMenu} src="/imagenes/Actualizar_Stock.png" alt="Actualizar Stock" />
                    <h3>Actualizar Stock</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/productos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Productos.png" alt="Productos" />
                    <h3>Productos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelEncargado;