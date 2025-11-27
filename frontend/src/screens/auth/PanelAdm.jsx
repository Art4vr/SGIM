import api from '../../api/axiosConfig';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/common/paneles.module.css';
import Encabezado from '../../components/Encabezado.jsx';
import AlertasInventario from '../../components/AlertasInventario.jsx';


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
                    <h3 className={styles.nombreMenu}>Usuarios</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3 className={styles.nombreMenu}>Proveedores</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3 className={styles.nombreMenu}>Inventario</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="Platillos" />
                    <h3 className={styles.nombreMenu}>Platillos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/productos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Productos.png" alt="Productos" />
                    <h3 className={styles.nombreMenu}>Productos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3 className={styles.nombreMenu}>Imprevistos</h3>
                </button>
            </div>
            <div>
                <AlertasInventario/>
            </div>
        </div>
    );
};

export default PanelAdm;