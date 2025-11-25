import api from '../../api/axiosConfig';
import { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/common/paneles.module.css';
import stylesCommon from '../../styles/common/common.module.css';
import Encabezado from '../../components/Encabezado';


const PanelChef = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            {/* Encabezado */}
            <Encabezado/>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                <button className={styles.tarjetas} onClick={() => navigate('/ordenChef')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/ordenes.png" alt="ordenes" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3 className={styles.nombreMenu}> Ordenes</h3>
                    </div>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/platillos')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/platillos.png" alt="platillos" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3 className={styles.nombreMenu}>Platillos</h3>
                    </div>
                </button>

                <button className={styles.tarjetas} onClick={() => navigate('/RegistroImprevisto')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/imprevistos.png" alt="imprevistos" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3 className={styles.nombreMenu}>Imprevistos</h3>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PanelChef;