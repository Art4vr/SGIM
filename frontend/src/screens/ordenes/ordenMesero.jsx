import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlatillos } from '../../api/platilloApi';
import {
  getOrdenes,
  crearOrden,
  getPlatillosOrden,
  agregarPlatilloOrden,
  eliminarPlatilloOrden,
  getMesas,
  modificarOrden
} from '../../api/ordenMeseroApi';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/ordenes/orden.module.css';

const OrdenMesero = () => {
  const { user } = useAuth();

  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [platillos, setPlatillos] = useState([]);
  const [ordenPlatillos, setOrdenPlatillos] = useState([]);
  const [cantidadPlatillo, setCantidadPlatillo] = useState({});
  const [filtros, setFiltros] = useState({ categoria: '' });
  const [vista, setVista] = useState('ordenes'); // "ordenes" | "detalle" | "agregar"

  // ---------------------- CARGAS INICIALES ----------------------
  useEffect(() => {
    cargarMesas();
    cargarOrdenes();
    cargarPlatillos();
  }, []);


  const cargarMesas = async () => {
    try {
      const response = await getMesas();
      setMesas(response.data);
    } catch (err) {
      console.error('Error al cargar mesas:', err);
    }
  };

  const cargarOrdenes = async () => {
    try {
      const response = await getOrdenes();
      setOrdenes(response.data.filter((o) => o.estado === 'abierta'));
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    }
  };

  const cargarPlatillos = async () => {
    try {
      const response = await getPlatillos();
      setPlatillos(response.data);
    } catch (err) {
      console.error('Error al cargar platillos:', err);
    }
  };


  // ---------------------- CREAR ORDEN ----------------------
  const handleCrearOrden = async () => {
    if (!mesaId) return alert('Selecciona una mesa');
    try {
      await crearOrden({ idUsuario: user.id, idMesa: mesaId });
      alert('Orden creada exitosamente');
      setMesaId('');
      cargarOrdenes();
      cargarMesas();
    } catch (err) {
      console.error('Error al crear orden:', err);
      alert('No se pudo crear la orden');
    }
  };


  // ---------------------- SELECCIONAR ORDEN ----------------------
  const seleccionarOrden = async (orden) => {
    setOrdenSeleccionada(orden);
    setVista('detalle');
    try {
      const response = await getPlatillosOrden(orden.idOrden);
      setOrdenPlatillos(response.data);
      console.log('Platillos de la orden:', response.data);
    } catch (err) {
      console.error('Error al cargar platillos de la orden:', err);
    }
  };

  // ---------------------- AGREGAR PLATILLO ----------------------
const handleAgregarPlatillo = async (platilloId) => {
  const cantidad = cantidadPlatillo[platilloId] || 1;
  if (!ordenSeleccionada) return alert('Selecciona una orden primero');

  const platillo = platillos.find(p => p.idPlatillo === platilloId);
  if (!platillo) return alert('Platillo no encontrado');


  try {
    await agregarPlatilloOrden(ordenSeleccionada.idOrden, {
      idPlatillo: platilloId,
      cantidad,
      precioUnitario: platillo.precio
    });

    alert('Platillo agregado correctamente');


    // 🔹 Refrescar detalle y lista de órdenes
    await seleccionarOrden(ordenSeleccionada);
    await cargarOrdenes();

    // Reiniciar cantidad
    setCantidadPlatillo({ ...cantidadPlatillo, [platilloId]: 1 });

  } catch (err) {
    console.error('❌ Error al agregar platillo:', err);
    alert('No se pudo agregar el platillo a la orden');
  }
};

// ---------------------- ELIMINAR PLATILLO ----------------------
const handleEliminarPlatillo = async (platilloId) => {
  if (!ordenSeleccionada) return;
  try {
    await eliminarPlatilloOrden(ordenSeleccionada.idOrden, platilloId);
    alert('Platillo eliminado correctamente');

    // 🔹 Refrescar detalle y lista de órdenes
    await seleccionarOrden(ordenSeleccionada);
    await cargarOrdenes();

  } catch (err) {
    console.error('Error al eliminar platillo:', err);
  }
};


  // ---------------------- FINALIZAR ORDEN ----------------------
  const handleFinalizarOrden = async () => {
    if (!ordenSeleccionada) return alert('Selecciona una orden primero');
    try {
      await modificarOrden(ordenSeleccionada.idOrden, { estado: 'cerrada' });
      alert(`Orden #${ordenSeleccionada.idOrden} finalizada`);
      setOrdenSeleccionada(null);
      setVista('ordenes');
      cargarOrdenes();
      cargarMesas();
    } catch (err) {
      console.error('Error al finalizar orden:', err);
      alert('No se pudo finalizar la orden');
    }
  };

  // ---------------------- CAMBIAR CANTIDAD (+/-) ----------------------
  const cambiarCantidad = (platilloId, delta) => {
    setCantidadPlatillo(prev => {
      const actual = prev[platilloId] || 1;
      const nueva = Math.max(1, actual + delta);
      return { ...prev, [platilloId]: nueva };
    });
  };

  // ---------------------- FILTROS ----------------------
  const handleFiltroChange = (e) => {
    setFiltros({ categoria: e.target.value });
  };

  const categorias = [...new Set(platillos.map(p => p.categoria))];
  const platillosFiltrados = platillos.filter(
    (p) => filtros.categoria === '' || p.categoria === filtros.categoria
  );

  // ---------------------- RENDER ----------------------
  return (
    <div className={styles.contenidoPrincipal}>
      <h1 className={styles.tituloPrincipal}>Gestión de Órdenes</h1>

      {/* === VISTA PRINCIPAL === */}
      {vista === 'ordenes' && (
        <>
          <section>
            <h2>Crear Orden</h2>
            <div>
              <select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
                <option value="">Selecciona una mesa</option>
                {mesas.map((mesa) => (
                  <option key={mesa.idMesa} value={mesa.idMesa}>
                    Mesa {mesa.numeroMesa} ({mesa.estado})
                  </option>
                ))}
              </select>
              <button onClick={handleCrearOrden}>Crear Orden</button>
            </div>
          </section>

          <section>
            <h2>Órdenes Abiertas</h2>
            <ul className={styles.listaOrdenes}>
              {ordenes.map((orden) => (
                <li key={orden.idOrden}>
                  <b>Orden #{orden.idOrden}</b> — Mesa {orden.mesa} — Total: ${orden.total}
                  <button onClick={() => seleccionarOrden(orden)}>Ver Platillos</button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* === DETALLE DE ORDEN === */}
      {vista === 'detalle' && ordenSeleccionada && (
        <section className={styles.contenedorPlatillos}>
          <h3>Orden #{ordenSeleccionada.idOrden} — Mesa {ordenSeleccionada.mesa}</h3>
          <button onClick={() => setVista('ordenes')}>← Volver</button>

          <ul>
            {ordenPlatillos.map((p) => (
              <li key={p.Platillo_idPlatillo}>
                <b>{p.platillo}</b> — Cant: {p.cantidad} — ${p.precioUnitario}
                <button onClick={() => handleEliminarPlatillo(p.Platillo_idPlatillo)}>Eliminar</button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '15px' }}>
            <button onClick={() => setVista('agregar')}>Agregar Platillos</button>
            <button onClick={handleFinalizarOrden}>Finalizar Orden</button>
          </div>
        </section>
      )}

      {/* === AGREGAR PLATILLOS === */}
      {vista === 'agregar' && (
        <section className={styles.contenedorPlatillos}>
          <h3>Agregar Platillos</h3>
          <button onClick={() => setVista('detalle')}>← Volver</button>

          {/* FILTRO POR CATEGORÍA */}
          <div>
            <label>Filtrar por categoría: </label>
            <select value={filtros.categoria} onChange={handleFiltroChange}>
              <option value="">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <ul>
            {platillosFiltrados.map((platillo) => (
              <li key={platillo.idPlatillo}>
                <b>{platillo.nombre}</b> — {platillo.categoria} — ${platillo.precio}
                <div>
                  <button onClick={() => cambiarCantidad(platillo.idPlatillo, -1)}>−</button>
                  <span>{cantidadPlatillo[platillo.idPlatillo] || 1}</span>
                  <button onClick={() => cambiarCantidad(platillo.idPlatillo, 1)}>+</button>
                </div>
                <button onClick={() => handleAgregarPlatillo(platillo.idPlatillo)}>Agregar</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default OrdenMesero;
