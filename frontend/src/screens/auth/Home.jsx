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
                <h1 className={styles.title}>MAKIMANAGE</h1>
                <h2 className={styles.subtitle}>BIENVENIDO</h2>
                <button className={styles.loginBtn} onClick={() => navigate('/Login')}>INICIAR <MdOutlineLogin /></button>
                <button className={styles.registerBtn} onClick={() => navigate('/NuevoUsuario')}>REGISTRAR <RiUserAddFill /></button>
                <footer>
                    
                    <button className={styles.logoutBtn} onClick={handleLogout}>Log Out <BiLogOut /></button>
                </footer>
            </div>
        </div>
    );
}


export default Home;