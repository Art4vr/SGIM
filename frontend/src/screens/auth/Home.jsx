import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/auth/Home.module.css';
import { MdOutlineLogin } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import api from '../../api/axiosConfig';
import { RiUserAddFill } from "react-icons/ri";

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
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout(); // Esto hace POST /logout, limpia user y localStorage
            navigate('/'); // Redirige al login
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

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
                <button className={styles.loginBtn} onClick={() => navigate('/Login')}>INICIAR <MdOutlineLogin /></button>
            </div>
        </div>
    );
}


export default Home;