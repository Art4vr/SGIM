import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/Login.module.css';

/**
 * Componente de inicio de sesión (simulado).
 * 
 * Este componente permite ingresar un usuario y una comtraseña para iniciar sesion
 */

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    //Funcion para el manejo del login
    const handleLogin = async (e) => { // Maneja el evento onSubmit del formulario
        e.preventDefault(); // Evita que se envie el formulario y recargue la pagina

        // verifica que no queden campos vacios
        if (!username || !password) {
            setErrorMessage('Debes ingresar usuario y contraseña');
            return;
        }

        console.log(username, password);

        //llama a la api para verificar las credenciales
        try{
            const response = await axios.post('/api/login',{username,password});
            console.log(response.data.rol);
            console.log('CORRECTO LOGIN')
            if (response.status === 200){
                if (response.data.rol === 'chef'){
                    navigate('/otra')
                }
            }
        }catch(err){
            setErrorMessage('Credenciales incorrectas o error en el servidor:',err);
            console.log('Error de autenticación:', err);
        }

        // Redirige según "rol" ingresado como username
        //switch (username.toLowerCase()) {
        //    case 'chef':
        //        navigate('/inventory', { replace: true });
        //        break;
        //    case 'encargado':
        //        navigate('/einventario', { replace: true });
        //        break;
        //    case 'gerente':
        //        navigate('/gerentes', { replace: true });
        //        break;
        //    case 'adm':
        //        navigate('/admc', { replace: true });
        //        break;
        //    default:
        //        setErrorMessage('Rol no reconocido');
        //}
    };

    return (
        <div
            className={styles.bodyContainer}
            style={{ backgroundImage: 'url(/imagenes/FondoMK.PNG)' }}
        >
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <div className={styles.avatar}>
                        <img src="/imagenes/Avatar.png" alt="Avatar" />
                    </div>

                    <h2>Iniciar Sesión</h2>

                    <form onSubmit={handleLogin}>
                        <div className={styles.inputContainer}>
                            <label>Usuario / Rol</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>Contraseña</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className={styles.showPasswordContainer}>
                                <label>Mostrar Contraseña</label>
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <button className={styles.loginBtn} type="submit">
                            INGRESAR
                        </button>
                        <button
                            className={styles.registerBtn}
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            REGISTRAR
                        </button>

                        {errorMessage && <p className={styles.message}>{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
