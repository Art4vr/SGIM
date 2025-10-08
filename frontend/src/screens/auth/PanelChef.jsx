import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/platillos/Platillo.module.css';


const Panel = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.menuBoton}><img  src="/imagenes/menu_btn.png" alt="LogoMK" /></button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>
            <div className={styles.contenido}>
                <button className={styles.tarjetas}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/ordenes.png" alt="ordenes" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Ordenes</h3>
                    </div>
                </button>
                <button className={styles.tarjetas}>
                    <div >
                        <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="platillos" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Platillos</h3>
                    </div>
                </button>
                <button className={styles.tarjetas}>
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

export default Panel;