import api from '../../api/axiosConfig';
import { useState, botonRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/auth/PanelAdm.module.css';
import Encabezado from '../../components/Encabezado';



const PanelMesero = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            {/* Encabezado */}
            <Encabezado/>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/OrdenesMesero')}>
                    <img className={styles.imagenMenu} src="/imagenes/Orden_Mesero.png" alt="Ordenes Mesero" />
                    <h3 className={styles.nombreMenu}>Ordenes Mesero</h3>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <img className={styles.imagenMenu} src="/imagenes/Platillos.png" alt="Platillos" />
                    <h3 className={styles.nombreMenu}>Platillos</h3>
                </button>
                {/*
                <button className={styles.tarjetas} onClick={() => navigate('/verMenu')}>
                    <img className={styles.imagenMenu} src="/imagenes/VerM.png" alt="Ver Menu" />
                    <h3>Ver Menu</h3>
                </button>
                */}

                <button className={styles.tarjetas} onClick={() => navigate('/RegistroImprevistoMesero')}>
                    <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="Imprevistos" />
                    <h3 className={styles.nombreMenu}>Imprevistos</h3>
                </button>
            </div>
        </div>
    );
};

export default PanelMesero;