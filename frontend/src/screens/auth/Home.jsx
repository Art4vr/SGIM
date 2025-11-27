import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/Home.module.css';
import stilesCommon2 from '../../styles/common/common2.module.css';

/**
 * Componente de pagina de inicio de la aplicación
 * 
 * Este componente da la bienvenida a los usuarios y le da las opciones de ir al
 * apartado de Iniciar sesión o Registrar un nuevo usuario.
 * 
 * @component
 * @returns {JSX.Element} Pagina de inicio de la aplicación
 */
const Home = () => {
    const navigate = useNavigate();

    return (
        <div
            className={styles.bodyContainer}
            style={{ backgroundImage: 'url(/imagenes/FondoMK.PNG)' }}
        >
            <div className={styles.homeContainer}>
                <div className={styles.avatar}>
                    <img src="/imagenes/MKSF.png" alt="Avatar" />
                </div>
                <h1 className={styles.title}>SGIM</h1>
                <h2 className={styles.subtitle}>Sistema de Gestión de Inventarios y Menú para Restaurantes</h2>
                <h3 className={styles.welcome}>Bienvenido</h3>
                <button className={stilesCommon2.Btn} onClick={() => navigate('/Login')}>INICIAR</button>
            </div>
        </div>
    );
}


export default Home;