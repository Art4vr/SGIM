import api from '../../api/axiosConfig';
import { useState, botonRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/common/paneles.module.css';
import Encabezado from '../../components/Encabezado';
import AlertasInventario from '../../components/AlertasInventario';

const PanelEncargado = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Encabezado */}
            <Encabezado/>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/proveedores')}>
                    <img className={styles.imagenMenu} src="/imagenes/Proveedores.png" alt="Proveedores" />
                    <h3 className={styles.nombreMenu}>Proveedores</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/inventario')}>
                    <img className={styles.imagenMenu} src="/imagenes/Inventario.png" alt="Inventario" />
                    <h3 className={styles.nombreMenu}>Inventario</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/actualizarStock')}>
                    <img className={styles.imagenMenu} src="/imagenes/Actualizar_Stock.png" alt="Actualizar Stock" />
                    <h3 className={styles.nombreMenu}>Actualizar Stock</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/productos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Productos.png" alt="Productos" />
                    <h3 className={styles.nombreMenu}>Productos</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/RegistroImprevisto')}>
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

export default PanelEncargado;