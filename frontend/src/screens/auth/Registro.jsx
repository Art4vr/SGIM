import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/Register.module.css';

/**
 * Componente de Registro de un Usuario (simulado)
 * 
 * Permite ingresar usuario, contraseña y especialidad, y redirige al login
 * sin necesidad de un backend.
 */
const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        if (!username || !password || !specialty) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        // Simulamos el registro exitoso
        setMessage('Usuario registrado con éxito');

        // Redirigimos al login después de 1.5 segundos
        setTimeout(() => navigate('/login'), 1500);
    };

    return (
        <div
            className={styles.bodyContainer}
            style={{ backgroundImage: 'url(/imagenes/FondoMK.PNG)' }}
        >
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h1 className={styles.title}>Registro</h1>

                    <form onSubmit={handleRegister}>
                        <div className={styles.inputContainer}>
                            <label>Usuario</label>
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

                        <div className={styles.inputContainer}>
                            <label>Especialidad</label>
                            <select
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="Chef">Chef</option>
                                <option value="Encargado de Inventario">Encargado de Inventario</option>
                                <option value="Gerente">Gerente</option>
                            </select>
                        </div>

                        <button className={styles.registerBtn} type="submit">
                            REGISTRAR
                        </button>
                        <button
                            className={styles.loginBtn}
                            type="button"
                            onClick={() => navigate('/login')}
                        >
                            VOLVER AL LOGIN
                        </button>

                        {message && <p className={styles.message}>{message}</p>}
                    </form>

                    {/* <WhatsAppButton pageName="registro"/> */}
                </div>
            </div>
        </div>
    );
};

export default Register;
