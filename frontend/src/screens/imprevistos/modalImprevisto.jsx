import React, { useState, useEffect } from 'react';
import styles from '../../styles/imprevistos/imprevistos.module.css';
import api from '../../api/axiosConfig';

const ModalEliminarImprevisto = ({ visible, mensaje, modalAccion, manejarAccion, onClose }) => {
    //
    if(!visible) return null;

    // Lógica de título y acciones según el tipo de modal
    const getModalTitle = () => {
        if (modalAccion === 'eliminar') return 'Eliminar Imprevisto';
        return '';
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("accion modal: ", modalAccion);
        manejarAccion(modalAccion);
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{getModalTitle()}</h2>
                
                {/* Eliminar Imprevisto */}
                
                <div className={styles.modalMessage}>
                    <p>{mensaje}</p>
                    <div className={styles.modalButtons}>
                        <button className={styles.btnEliminar} onClick={handleSubmit}>Eliminar</button>
                        <button
                            className={styles.btnCancelar}
                            onClick={() => { onClose(); }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>

            
            </div>
        </div>
    );
};

export default ModalEliminarImprevisto;