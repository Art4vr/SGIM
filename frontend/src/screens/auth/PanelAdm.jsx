import api from '../../api/axiosConfig';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import Encabezado from '../../components/Encabezado.jsx';


const PanelAdm = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>
            
            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/usuarios')}>
                    <img className={styles.imagenMenu} src="/imagenes/Usuarios.png" alt="Usuarios" />
                    <h3>Usuarios</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3>Proveedores</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3>Inventario</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="Platillos" />
                    <h3>Platillos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/reportes')}>
                    <img className={styles.imagenMenu} src="/imagenes/Reportes.png" alt="Reportes" />
                    <h3>Reportes</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelAdm;