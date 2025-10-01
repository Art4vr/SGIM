import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { Link,useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/Login.module.css';

/**
 * Componente de inicio de sesión (simulado).
 * 
 * Este componente permite ingresar un usuario y una contraseña para iniciar sesión
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

        //llama a la api para verificar las credenciales
        try{
            const {data} = await api.post('/api/auth/Login',{username,password});
            console.log('Login OK:', data);
            if (data.rol === 1){
                navigate('/Panel');
            }else{
                navigate('/Home');
            }
        }catch(err){
            const msg = err.response?.data?.mensaje || 'Error en el servidor';
            setErrorMessage(msg);
        }

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
                            onClick={() => navigate('/NuevoUsuario')}
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
