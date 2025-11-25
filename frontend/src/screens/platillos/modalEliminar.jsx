import React from "react";
import styles from '../../styles/imprevistos/imprevistos.module.css';

const ModalEliminarPlatillo = ({ visible, platillo, onConfirm, onClose }) => {
    if (!visible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>Eliminar Platillo</h2>

                <div className={styles.modalMessage}>
                    <p>
                        ¿Estás seguro de que deseas eliminar el platillo{" "}
                        <strong>{platillo?.nombre}</strong>?
                    </p>

                    <div className={styles.modalButtons}>
                        <button className={styles.btnEliminar} onClick={onConfirm}>
                            Eliminar
                        </button>

                        <button className={styles.btnCancelar} onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalEliminarPlatillo;
