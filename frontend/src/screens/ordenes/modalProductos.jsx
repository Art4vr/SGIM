import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { getProductos, getUnidades } from '../../api/productoApi';
import styles from "../../styles/ordenes/modal.module.css";

const ModalProductos = ({ platillo, onClose }) => {
  const [ingredientes, setIngredientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Cargar productos y unidades para mapear nombres
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const productosRes = await getProductos();
        setProductos(productosRes.data || []);
        const unidadesRes = await getUnidades();
        setUnidades(unidadesRes.data || []);
      } catch (err) {
        console.error("Error cargando productos/unidades:", err);
      }
    };
    cargarDatos();
  }, []);

  // Cargar ingredientes del platillo
  useEffect(() => {
    if (!platillo) return;

    const cargarIngredientes = async () => {
      try {
        const resp = await api.get(
          `/api/productosPlatillo/obtener/${platillo.Platillo_idPlatillo}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        const data = Array.isArray(resp.data.resultados) ? resp.data.resultados : [];

        // Mapear nombreProducto y unidad de medida legible
        const lista = data.map(i => {
          const prod = productos.find(p => Number(p.idProducto) === Number(i.Producto_idProducto));
          const uni = unidades.find(u => Number(u.idUnidadMedida) === Number(i.UnidadMedida_idUnidadMedida));
          return {
            ...i,
            nombreProducto: prod ? prod.nombre : `Producto ${i.Producto_idProducto}`,
            unidadMedida: uni ? uni.abreviatura : i.UnidadMedida_idUnidadMedida
          };
        });

        setIngredientes(lista);
        if (lista.length === 0) setMensaje("No hay ingredientes registrados.");
      } catch (err) {
        console.error("Error al obtener ingredientes del platillo:", err);
        setIngredientes([]);
        setMensaje("Ocurrió un error al cargar los ingredientes.");
      }
    };

    cargarIngredientes();
  }, [platillo, productos, unidades]);

  if (!platillo) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Ingredientes de {platillo.platillo}</h2>
        </div>

        <p><b>ID Platillo Orden:</b> {platillo.idPlatilloOrden}</p>
        <p><b>Cantidad pedida:</b> {platillo.cantidad}</p>

        <h3>Receta</h3>

{mensaje && <p>{mensaje}</p>}

{ingredientes.length > 0 && (
  <table className={styles.ingredientesTable}>
    <thead>
      <tr>
        <th>Producto</th>
        <th>ID PlatilloOrden</th>
        <th>Cantidad pedida</th>
      </tr>
    </thead>
    <tbody>
      {ingredientes.map((i) => (
        <tr key={i.Producto_idProducto}>
          <td>{i.nombreProducto}</td>
          <td>{platillo.idPlatilloOrden}</td>
          <td>{i.cantidad} {i.unidadMedida}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}


        <button className={styles.closeButton} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalProductos;
