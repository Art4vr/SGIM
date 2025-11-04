import React, { useState, useEffect } from 'react';
import { getPlatillos } from '../../api/platilloApi';
import { 
  getOrdenes,
  crearOrden,
  getPlatillosOrden,
  agregarPlatilloOrden,
  eliminarPlatilloOrden,
  getMesas,
  modificarOrden   // <-- import para finalizar orden
} from '../../api/ordenMeseroApi';
import { useAuth } from '../../context/AuthContext';

const OrdenMesero = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [platillos, setPlatillos] = useState([]);
  const [cantidadPlatillo, setCantidadPlatillo] = useState({});
  const [ordenPlatillos, setOrdenPlatillos] = useState([]);

  // Cargar mesas
  const cargarMesas = async () => {
    try {
      const response = await getMesas();
      setMesas(response.data);
    } catch (err) {
      console.error('Error al cargar mesas:', err);
    }
  };

  // Cargar órdenes abiertas
  const cargarOrdenes = async () => {
    try {
      const response = await getOrdenes();
      setOrdenes(response.data.filter(o => o.estado === 'abierta'));
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
    }
  };

  // Cargar platillos disponibles
  const cargarPlatillos = async () => {
    try {
      const response = await getPlatillos();
      setPlatillos(response.data);
    } catch (err) {
      console.error('Error al cargar platillos:', err);
    }
  };

  useEffect(() => {
    cargarMesas();
    cargarOrdenes();
    cargarPlatillos();
  }, []);

  // Crear orden
  const handleCrearOrden = async () => {
    if (!mesaId) return alert('Selecciona una mesa');
    try {
      await crearOrden({ idUsuario: user.id, idMesa: mesaId });
      alert('Orden creada exitosamente');
      cargarOrdenes();
      setMesaId('');
      await cargarMesas(); // recarga las mesas para ver el estado actualizado
    } catch (err) {
      console.error('Error al crear orden:', err);
      alert('No se pudo crear la orden');
    }
  };

  // Seleccionar orden y cargar platillos de la orden
  const seleccionarOrden = async (orden) => {
    setOrdenSeleccionada(orden);
    try {
      const response = await getPlatillosOrden(orden.idOrden);
      setOrdenPlatillos(response.data);
      console.log('Platillos de la orden:', response.data);
    } catch (err) {
      console.error('Error al cargar platillos de la orden:', err);
    }
  };

  // Agregar platillo a la orden
  const handleAgregarPlatillo = async (platilloId) => {
    const cantidad = parseInt(cantidadPlatillo[platilloId]);
    if (!ordenSeleccionada) return alert('Selecciona una orden primero');
    if (!cantidad || cantidad <= 0) return alert('Ingresa una cantidad válida');

    const platillo = platillos.find(p => p.idPlatillo === platilloId);
    if (!platillo) return alert('Platillo no encontrado');

    try {
      await agregarPlatilloOrden(ordenSeleccionada.idOrden, {
        idPlatillo: platilloId,
        cantidad,
        precioUnitario: platillo.precio
      });

      alert('Platillo agregado correctamente');
      setCantidadPlatillo({ ...cantidadPlatillo, [platilloId]: '' });

      // Recargar platillos de la orden y órdenes (total)
      seleccionarOrden(ordenSeleccionada);
      cargarOrdenes();
    } catch (err) {
      console.error('Error al agregar platillo:', err);
      alert('No se pudo agregar el platillo a la orden');
    }
  };

  // Eliminar platillo de la orden
  const handleEliminarPlatillo = async (platilloId) => {
    if (!ordenSeleccionada) return;
    try {
      await eliminarPlatilloOrden(ordenSeleccionada.idOrden, platilloId);
      alert('Platillo eliminado correctamente');
      seleccionarOrden(ordenSeleccionada);
      cargarOrdenes();
    } catch (err) {
      console.error('Error al eliminar platillo:', err);
    }
  };

  // --------------------- FINALIZAR ORDEN ---------------------
  const handleFinalizarOrden = async () => {
    if (!ordenSeleccionada) return alert('Selecciona una orden primero');
    try {
      await modificarOrden(ordenSeleccionada.idOrden, { estado: 'cerrada' });
      alert(`Orden #${ordenSeleccionada.idOrden} finalizada`);
      setOrdenSeleccionada(null);
      cargarOrdenes();  // recargar órdenes abiertas
      cargarMesas();    // recargar mesas para ver disponibles/ocupadas
    } catch (err) {
      console.error('Error al finalizar orden:', err);
      alert('No se pudo finalizar la orden');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Crear Orden</h2>
      <select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
        <option value="">Selecciona una mesa</option>
        {mesas.map((mesa) => (
          <option key={mesa.idMesa} value={mesa.idMesa}>
            Mesa {mesa.numeroMesa} ({mesa.estado})
          </option>
        ))}
      </select>
      <button onClick={handleCrearOrden} style={{ marginLeft: '10px' }}>Crear Orden</button>

      <h2>Órdenes Abiertas</h2>
      <ul>
        {ordenes.map((orden) => (
          <li key={orden.idOrden}>
            <b>Orden #{orden.idOrden}</b> - Mesa {orden.mesa} - Usuario {orden.usuario} - Total ${orden.total}
            <button style={{ marginLeft: '10px' }} onClick={() => seleccionarOrden(orden)}>Ver Platillos</button>
          </li>
        ))}
      </ul>

      {/* Vista de platillos de la orden */}
      {ordenSeleccionada && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>Platillos de Orden #{ordenSeleccionada.idOrden}</h3>
          <button style={{ marginBottom: '10px' }} onClick={() => setOrdenSeleccionada(null)}>Cerrar vista</button>

          <ul>
            {ordenPlatillos.map((platillo) => (
              <li key={platillo.Platillo_idPlatillo} style={{ marginBottom: '10px' }}>
                <b>{platillo.platillo}</b> - Categoría: {platillo.categoria || 'N/A'} - Precio unitario: ${platillo.precioUnitario} - Cantidad: {platillo.cantidad} - Estado: {platillo.estado}
                <button style={{ marginLeft: '10px' }} onClick={() => handleEliminarPlatillo(platillo.Platillo_idPlatillo)}>Eliminar</button>
              </li>
            ))}
          </ul>

          {/* BOTÓN PARA FINALIZAR ORDEN */}
          <button style={{ marginTop: '15px', backgroundColor: 'green', color: 'white', padding: '8px 12px', borderRadius: '5px' }} onClick={handleFinalizarOrden}>
            Finalizar Orden
          </button>

          <h4>Agregar Platillos</h4>
          <ul>
            {platillos.map((platillo) => (
              <li key={platillo.idPlatillo}>
                {platillo.nombre} ({platillo.categoria}) - ${platillo.precio}
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  value={cantidadPlatillo[platillo.idPlatillo] || ''}
                  onChange={(e) => setCantidadPlatillo({ ...cantidadPlatillo, [platillo.idPlatillo]: e.target.value })}
                  style={{ width: '60px', marginLeft: '10px' }}
                />
                <button style={{ marginLeft: '10px' }} onClick={() => handleAgregarPlatillo(platillo.idPlatillo)}>Agregar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrdenMesero;
