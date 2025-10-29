//Vista general del inventario
//Muestra una tabla con el inventario de productos con sus respectivos lotes
//En caso de que haya mas de un inventario por producto, ordenara primero los que tengan la fecha de ingreso (fechaIngreso) más antigua

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from '../../styles/imprevistos/imprevistos.module.css';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';

import { getProductos, getUnidades, getCategorias } from '../../api/productoApi';
import { getProveedores } from '../../api/proveedorApi';

const VistaInventario = () => {
    const { logout, loading } = useAuth();
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setCargando(true);
            try {
                const productosData = await getProductos();
                console.log('PRODUCTOS INVENTARIO:', productosData.data);
                setProductos(productosData.data);
            } catch (error) {
                setMensaje('Error al cargar los productos');
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            {cargando ? (
                <ClipLoader />
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Unidad</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto.id}>
                                <td>{producto.nombre}</td>
                                <td>{producto.categoria}</td>
                                <td>{producto.unidad}</td>
                                <td>{producto.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VistaInventario;
