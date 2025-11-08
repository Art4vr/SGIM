import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/auth/perfilUsuario.module.css'; 
import api from '../api/axiosConfig'; 
import stylesCommon from '../styles/common/common.module.css';

const PerfilUsuario = () => {
    const [perfilAbierto, setPerfilAbierto] = useState(false);
    const [perfilData, setPerfilData] = useState(null);
    const [cargando, setCargando] = useState(true);
    const perfilRef = useRef(null);

    useEffect(() => {
        // Cargar los datos del perfil al montar el componente
        const cargarPerfil = async () => {
        try {
            // Esta es la ruta que definiremos en 'rutas.js'
            const res = await api.get('/api/perfil/me'); 
            setPerfilData(res.data);
        } catch (error) {
            console.error("Error cargando perfil:", error);
            //setPerfilData({ nombre: 'Error', username: 'N/A', rolDescripcion: 'No se pudo cargar' });
        } finally {
            setCargando(false);
        }
        };
        cargarPerfil();
    }, []);

    // Hook para cerrar el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (perfilRef.current && !perfilRef.current.contains(event.target)) {
            setPerfilAbierto(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [perfilRef]);

    return (
        <div className={styles.perfilContainer} ref={perfilRef}>
        <button 
            className={stylesCommon.logousuario} 
            onClick={() => setPerfilAbierto(!perfilAbierto)}
        >
            <img src="/imagenes/Avatar.png" alt="Perfil" />
        </button>

        {/* Menú desplegable */}
        {perfilAbierto && (
            <div className={styles.perfilDropdown}>
            {cargando ? (
                <p className={styles.loading}>Cargando...</p>
            ) : perfilData ? (
                <>
                {/* Muestra el nombre completo */}
                <h3>{perfilData.nombre}</h3>
                {/* Muestra el username */}
                <p className={styles.username}>{perfilData.username}</p>
                {/* Muestra el Rol y su Descripción (ej. Gerente (Acceso total...)) */}
                <p className={styles.descripcion}>
                    {perfilData.rolNombre} ({perfilData.rolDescripcion})
                </p>
                </>
            ) : (
                <p className={styles.error}>No se pudo cargar el perfil.</p>
            )}
            </div>
        )}
        </div>
    );
};

export default PerfilUsuario;