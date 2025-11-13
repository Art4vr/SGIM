import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/gerente/GerentePanel.module.css';

const GerentePanel = () => {
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const handleLogout = () => {
        // Aquí puedes agregar tu lógica de logout
        navigate('/');
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/Usuarios')}>Usuarios</li>
                    <li onClick={() => navigate('/Proveedores')}>Proveedores</li>
                    <li onClick={() => navigate('/Inventario')}>Inventario</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                {/* Administración de Usuarios */}
                <button className={styles.tarjetas} onClick={() => navigate('/Usuarios')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/usuarios.png" alt="Usuarios" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Administración de Usuarios</h3>
                    </div>
                </button>

                {/* Administración de Proveedores */}
                <button className={styles.tarjetas} onClick={() => navigate('/Proveedores')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/proveedores.png" alt="Proveedores" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Administración de Proveedores</h3>
                    </div>
                </button>

                {/* Administración de Inventario */}
                <button className={styles.tarjetas} onClick={() => navigate('/Inventario')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/inventario.png" alt="Inventario" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Administración de Inventario</h3>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default GerentePanel;
