import api from '../../api/axiosConfig';
import { useState, botonRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import Encabezado from '../../components/Encabezado';


const PanelEncargado = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3>Proveedores</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3>Inventario</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/actualizarStock')}>
                    <img className={styles.imagenMenu} src="/imagenes/Actualizar_Stock.png" alt="Actualizar Stock" />
                    <h3>Actualizar Stock</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/productos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Productos.png" alt="Productos" />
                    <h3>Productos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/imprevistos')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelEncargado;