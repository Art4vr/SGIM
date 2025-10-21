import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/auth/Register.module.css'; // Asegúrate que este archivo existe

const RegistroImprevisto = () => {
    const navigate = useNavigate();

    const {user,loading} = useAuth();
    const [idInventarioProducto, setIdInventarioProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [idUnidadMedida, setIdUnidadMedida] = useState('');
    const [message, setMessage] = useState('');

    if(loading){
        return <div>Cargando usuario...</div>; // Evita renderizar hasta que user esté disponible
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!idInventarioProducto || !cantidad) {
            setMessage('Los campos con * son obligatorios.');
            return;
        }

        try {
            const response = await axios.post('/api/imprevistos/crear', {
                idUsuarioReporta: user.id,
                idInventarioProducto,
                descripcion,
                cantidad,
                idUnidadMedida
            });

            setMessage('Imprevisto registrado con éxito');
            setTimeout(() => navigate('/PanelChef'), 1500); // Redirige al inicio
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
                    <h2 className={styles.title}>Registrar Imprevisto</h2>

                    <form onSubmit={handleRegister}>
                        <div className={styles.inputContainer}>
                            <h4>Usuario que Reporta: {user.username}</h4>
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
