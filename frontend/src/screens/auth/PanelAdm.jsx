import api from '../../api/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';


const PanelAdm = () => {
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
                    <li onClick={() => navigate('/usuarios')}>Usuarios</li>
                    <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                    <li onClick={() => navigate('/inventario')}>Inventario</li>
                    <li onClick={() => navigate('/platillos')}>Platillos</li>
                    <li onClick={() => navigate('/pedidos')}>Pedidos</li>
                    <li onClick={() => navigate('/reportes')}>Reportes</li>
                    <li onClick={() => navigate('/mesas')}>Mesas</li>
                    <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                    <li onClick={handleLogout}>Log Out</li>
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

                <button className={styles.tarjetas} onClick={() => navigate('/platillosAdm')}>
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

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistosAdm')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelAdm;