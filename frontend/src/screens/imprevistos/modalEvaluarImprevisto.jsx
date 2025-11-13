import React, { useState, useEffect } from 'react';
import styles from '../../styles/imprevistos/imprevistos.module.css';
import api from '../../api/axiosConfig';

const ModalEvaluarImprevisto = ({ visible, mensaje, imprevisto, modalAccion, manejarAccion, onClose }) => {
    //
    if(!visible) return null;

    // Lógica de título y acciones según el tipo de modal
    const getModalTitle = () => {
        if (modalAccion === 'evaluar') return 'Evaluar Imprevisto';
        if (modalAccion !== 'evaluar') return 'Error';
        return '';
    };



    const handleSubmit = (estado) => {
        manejarAccion(true, estado);
        console.log("accion modal: ", modalAccion);
        console.log("estado: ", estado);
        manejarAccion(true, estado);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{getModalTitle()}
                    <button 
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    ❌
                </button>
                {/* Evaluar Imprevisto */}
                </h2>
                
                

                
                <div className={styles.modalContent}>
                    <p className={styles.modalMessage}>{mensaje}</p>
                    <div className={styles.modalButtons}>
                        <button 
                            className={`${styles.btnAccion} ${styles.btnAutorizar}`}
                            onClick={() => handleSubmit('autorizado')}
                        >
                            Autorizar
                        </button>
                        <button 
                            className={`${styles.btnAccion} ${styles.btnRechazar}`}
                            onClick={() => handleSubmit('rechazado')}
                        >
                            Rechazar
                        </button>
                    </div>
                </div>

            
            </div>
        </div>
    );
};

export default ModalEvaluarImprevisto;