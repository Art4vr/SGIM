import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/auth/Register.module.css'; // Asegúrate que este archivo existe

const RegistroImprevisto = () => {
    const navigate = useNavigate();

    const [idUsuarioReporta, setIdUsuarioReporta] = useState('');
    const [idInventarioProducto, setIdInventarioProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [idUnidadMedida, setIdUnidadMedida] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!idUsuarioReporta || !idInventarioProducto || !cantidad) {
            setMessage('Los campos con * son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('/api/imprevistos/crear', {
                idUsuarioReporta,
                idInventarioProducto,
                descripcion,
                cantidad,
                idUnidadMedida
            });

            setMessage('Imprevisto registrado con éxito');
            setTimeout(() => navigate('/'), 1500); // Redirige al inicio
        } catch (err) {
            setMessage(err.response?.data?.mensaje || 'Error al registrar imprevisto');
        }
    };

    return (
        <div
            className={styles.bodyContainer}
            style={{ backgroundImage: 'url(/imagenes/FondoMK.PNG)' }}
        >
            <div className={styles.registerContainer}>
                <div className={styles.registerCard}>
                    <h1 className={styles.title}>Registrar Imprevisto</h1>

                    <form onSubmit={handleRegister}>
                        <div className={styles.inputContainer}>
                            <label>ID Usuario que Reporta *</label>
                            <input
                                type="number"
                                value={idUsuarioReporta}
                                onChange={(e) => setIdUsuarioReporta(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>ID Producto *</label>
                            <input
                                type="number"
                                value={idInventarioProducto}
                                onChange={(e) => setIdInventarioProducto(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>Descripción</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>Cantidad *</label>
                            <input
                                type="number"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputContainer}>
                            <label>ID Unidad de Medida</label>
                            <input
                                type="number"
                                value={idUnidadMedida}
                                onChange={(e) => setIdUnidadMedida(e.target.value)}
                            />
                        </div>

                        <button className={styles.registerBtn} type="submit">
                            REGISTRAR IMPREVISTO
                        </button>

                        <button
                            className={styles.loginBtn}
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            VOLVER AL INICIO
                        </button>

                        {message && <p className={styles.message}>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistroImprevisto;
