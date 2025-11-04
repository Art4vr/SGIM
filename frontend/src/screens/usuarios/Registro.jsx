import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import styles from '../../styles/auth/Register.module.css';
import stylesCommon from '../../styles/common/common.module.css';

/**
 * Componente de Registro de un Usuario (simulado)
 * 
 * Permite ingresar usuario, contraseña y especialidad, y redirige al login
 * sin necesidad de un backend.
 */
const Registro = () => {
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rolId, setRol] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !rolId || !nombre) {
            setMessage('Todos los campos son obligatorios.');
            return;
        }

        try{
            const response = await api.post('/api/usuarios/register',{
                nombre,
                username,
                password,
                rolId
            });
            setMessage('Usuario Creado con exito');
            setTimeout(() => navigate('/'), 1000); // Redirige al login despues de un segundo
        }catch(err){
            setMessage(err.response?.data?.mensaje|| 'Error al registrar');
        }

    };

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
    };

    const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
    };

    useEffect(() => { 
        const handleClickOutside = (event) =>{
            if(
                menuAbierto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                botonRef.current &&
                !botonRef.current.contains(event.target)
            ){
                setMenuAbierto(false);
            }
        }

        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        };
    }, [menuAbierto]);

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
                    <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                        <ul>
                            <li onClick={() => navigate('/Perfil')}>Perfil</li>
                            <li onClick={() => navigate('/Platillos')}>Platillos</li>
                            <li onClick={() => navigate('/Proveedores')}>Proveedores</li>
                            <li onClick={() => navigate('/Productos')}>Productos</li>
                            <li onClick={() => navigate('/Imprevistos')}>Ver Imprevistos</li>
                            <li onClick={() => navigate('/NuevoUsuario')}>Nuevo Usuario</li>
                            <li onClick={handleLogout}>Log Out</li>
                        </ul>
                    </div>
        
            <div className={styles.bodyContainer}>
                <div className={styles.registerContainer}>
                    <div className={styles.registerCard}>
                        <h1 className={styles.title}>Registro</h1>

                        <form onSubmit={handleRegister}>
                            <div className={styles.inputContainer}>
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>

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
                                <label>Cargo</label>
                                <select
                                    value={rolId}
                                    onChange={(e) => setRol(e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value={3}>Chef</option>
                                    <option value={2}>Encargado de Inventario</option>
                                    <option value={1}>Gerente</option>
                                    <option value={4}>Mesero</option>
                                </select>
                            </div>

                            <button className={styles.registerBtn} type="submit">
                                REGISTRAR
                            </button>
                            <button
                                className={styles.loginBtn}
                                type="button"
                                onClick={() => navigate('/Login')}
                            >
                                VOLVER AL LOGIN
                            </button>
                        
                        {message && <p className={stylesCommon.message}>{message}</p>}
                        </form>

                        {/* <WhatsAppButton pageName="registro"/> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
