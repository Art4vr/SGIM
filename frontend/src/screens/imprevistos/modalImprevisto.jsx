import React, { useState, useEffect } from 'react';
import styles from '../../styles/productos/producto.module.css';
import api from '../../api/axiosConfig';

const ModalImprevisto = ({ visible, mensaje, modalAccion, formData, handleInputChange, manejarAccion, onClose }) => {
    
    //

    // Definir variables para el estado del modal (esto depende de la acción)
    const { usuarioReporta, usuarioAprueba, producto, cantidad,medida } = formData; // Asegúrate de que estos estén bien definidos en tu estado
    const [usuarioReportaInput, setUsuarioReportaInput] = useState(usuarioReporta);
    const [usuarioApruebaInput, setUsuarioApruebaInput] = useState(usuarioAprueba);
    const [productoInput, setProductoInput] = useState(producto);
    const [cantidadInput, setCantidadInput] = useState(cantidad);
    const [medidaInput, setMedidaInput] = useState(medida);
    const [message, setMessage] = useState('');
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);
    if(!visible) return null;

    // Lógica de título y acciones según el tipo de modal
    const getModalTitle = () => {
        if (modalAccion === 'editar') return 'Editar Imprevisto';
        if (modalAccion === 'eliminar') return 'Eliminar Imprevisto';
        if (modalAccion === 'aprobar') return 'Aprobar Imprevisto';
        if (modalAccion === 'rechazar') return 'Rechazar Imprevisto';
        if (modalAccion !== 'rechazar') return 'Error';
        return '';
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        manejarAccion(modalAccion, { usuarioReporta: usuarioReportaInput, usuarioAprueba: usuarioApruebaInput, producto: productoInput, cantidad: cantidadInput, medida: medidaInput });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
                <h2 className={styles.modalTitle}>{getModalTitle()}</h2>
                
                {/* Formulario que cambia según la acción */}
                {modalAccion === 'eliminar' ? (
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
                ) : modalAccion === 'aprobar' ? (
                    <div className={styles.modalMessage}>
                        <p>{mensaje}</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.btnAprobar} onClick={handleSubmit}>Aprobar</button>
                            <button
                                className={styles.btnCancelar}
                                onClick={() => { onClose(); }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) :  modalAccion === 'rechazar' ? (
                    <div className={styles.modalMessage}>
                        <p>{mensaje}</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.btnRechazar} onClick={handleSubmit}>Rechazar</button>
                            <button
                                className={styles.btnCancelar}
                                onClick={() => { onClose(); }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Usuario que Reporta */}
                        <div className={styles.inputContainer}>
                            <label>Usuario que Reporta</label>
                            <input
                                type="text"
                                value={usuarioReportaInput}
                                onChange={(e) => setUsuarioReportaInput(e.target.value)}
                            />
                        </div>

                        {/* Medida */}
                        <div className={styles.inputContainer}>
                            <label>Medida</label>
                            <input
                                type="text"
                                value={medidaInput}
                                onChange={(e) => setMedidaInput(e.target.value)}
                            />
                        </div>

                        {/* Cantidad */}
                        <div className={styles.inputContainer}>
                            <label>Cantidad</label>
                            <input
                                type="number"
                                value={cantidadInput}
                                onChange={(e) => setCantidadInput(e.target.value)}
                            />
                        </div>

                        {/* Usuario que Autoriza */}
                        <div className={styles.inputContainer}>
                            <label>Usuario que Autoriza</label>
                            <input
                                type="text"
                                value=""
                                onChange={(e) => setUsuarioApruebaInput(e.target.value)}
                            />
                        </div>
                        {/* Producto */}
                        <div className={styles.inputContainer}>
                            <label>Producto</label>
                            <input
                                type="text"
                                value={productoInput}
                                onChange={(e) => setProductoInput(e.target.value)}
                            />
                        </div>

                        {/* Botones de guardar o cancelar */}
                        <div className={styles.modalButtons}>
                            <button type="submit" className={styles.btnGuardar}>Guardar</button>
                            <button
                                type="button"
                                className={styles.btnCancelar}
                                onClick={() => { onClose(); }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

            
            </div>
        </div>
    );
};

export default ModalImprevisto;