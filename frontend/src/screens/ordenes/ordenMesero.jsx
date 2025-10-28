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
import api from '../../api/axiosConfig'; // Asegúrate de tener tu instancia configurada
import stylesCommon from '../../styles/common/common.module.css'; // Ajusta la ruta a tu CSS
import stylesOrden from '../../styles/ordenes/orden.module.css';

const OrdenMesero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🟩 Estados del menú
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const botonRef = useRef(null);

  // 🟩 Estados del módulo de órdenes
  const [mesas, setMesas] = useState([]);
  const [mesaId, setMesaId] = useState('');
  const [ordenes, setOrdenes] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [platillos, setPlatillos] = useState([]);
  const [cantidadPlatillo, setCantidadPlatillo] = useState({});
  const [ordenPlatillos, setOrdenPlatillos] = useState([]);

  // --------------------- LÓGICA DEL MENÚ ---------------------
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleLogout = async () => {
    await api.post('/api/auth/logout');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuAbierto &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        botonRef.current &&
        !botonRef.current.contains(event.target)
      ) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  // --------------------- LÓGICA DE ÓRDENES ---------------------
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

  useEffect(() => {
    cargarMesas();
    cargarOrdenes();
    cargarPlatillos();
  }, []);

  const handleCrearOrden = async () => {
    if (!mesaId) return alert('Selecciona una mesa');
    try {
      await crearOrden({ idUsuario: user.id, idMesa: mesaId });
      alert('Orden creada exitosamente');
      cargarOrdenes();
      setMesaId('');
      await cargarMesas();
    } catch (err) {
      console.error('Error al crear orden:', err);
      alert('No se pudo crear la orden');
    }
  };

  const seleccionarOrden = async (orden) => {
    setOrdenSeleccionada(orden);
    try {
      const response = await getPlatillosOrden(orden.idOrden);
      setOrdenPlatillos(response.data);
    } catch (err) {
      console.error('Error al cargar platillos de la orden:', err);
    }
  };

  const handleAgregarPlatillo = async (platilloId) => {
    const cantidad = parseInt(cantidadPlatillo[platilloId]);
    if (!ordenSeleccionada) return alert('Selecciona una orden primero');
    if (!cantidad || cantidad <= 0) return alert('Ingresa una cantidad válida');

    const platillo = platillos.find((p) => p.idPlatillo === platilloId);
    if (!platillo) return alert('Platillo no encontrado');

    try {
      await agregarPlatilloOrden(ordenSeleccionada.idOrden, {
        idPlatillo: platilloId,
        cantidad,
        precioUnitario: platillo.precio
      });

      alert('Platillo agregado correctamente');
      setCantidadPlatillo({ ...cantidadPlatillo, [platilloId]: '' });

      seleccionarOrden(ordenSeleccionada);
      cargarOrdenes();
    } catch (err) {
      console.error('Error al agregar platillo:', err);
      alert('No se pudo agregar el platillo a la orden');
    }
  };

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

  const handleFinalizarOrden = async () => {
    if (!ordenSeleccionada) return alert('Selecciona una orden primero');
    try {
      await modificarOrden(ordenSeleccionada.idOrden, { estado: 'cerrada' });
      alert(`Orden #${ordenSeleccionada.idOrden} finalizada`);
      setOrdenSeleccionada(null);
      cargarOrdenes();
      cargarMesas();
    } catch (err) {
      console.error('Error al finalizar orden:', err);
      alert('No se pudo finalizar la orden');
    }
  };

  // --------------------- RENDER ---------------------
  return (
    <div className={stylesCommon.contenedorGeneral}>
      {/* 🟩 ENCABEZADO */}
      <div className={stylesCommon.header}>
        <button ref={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
          <img src="/imagenes/menu_btn.png" alt="Menú" />
        </button>
        <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi</h1>
        <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
      </div>

      {/* 🟩 MENÚ LATERAL */}
      <div
        ref={menuRef}
        className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}
      >
        <ul>
          <li onClick={() => navigate('/Perfil')}>Perfil</li>
          <li onClick={() => navigate('/Platillos')}>Platillos</li>
          <li onClick={() => navigate('/Proveedores')}>Proveedores</li>
          <li onClick={() => navigate('/Productos')}>Productos</li>
          <li onClick={() => navigate('/Imprevistos')}>Ver Imprevistos</li>
          <li onClick={() => navigate('/NuevoUsuario')}>Nuevo Usuario</li>
          <li onClick={handleLogout}>Log Out</li>
        </ul>
      </div>

      {/* 🟩 CONTENIDO PRINCIPAL */}
      <div className={stylesOrden.contenidoPrincipal}>
        <h1 className={stylesOrden.tituloPrincipal}>Pedidos</h1>
          <h2>Crear Orden</h2>
          <select value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
            <option value="">Selecciona una mesa</option>
            {mesas.map((mesa) => (
              <option key={mesa.idMesa} value={mesa.idMesa}>
                Mesa {mesa.numeroMesa} ({mesa.estado})
              </option>
            ))}
          </select>
          <button onClick={handleCrearOrden} style={{ marginLeft: '10px' }}>
            Crear Orden
          </button>

        <h2>Órdenes Abiertas</h2>
        <ul className={stylesOrden.listaOrdenes}>
          {ordenes.map((orden) => (
            <li key={orden.idOrden}>
              <b>Orden #{orden.idOrden}</b> - Mesa {orden.mesa} - Usuario {orden.usuario} - Total $
              {orden.total}
              <button style={{ marginLeft: '10px' }} onClick={() => seleccionarOrden(orden)}>
                Ver Platillos
              </button>
            </li>
          ))}
        </ul>

        {/* Vista de platillos de la orden */}
        {ordenSeleccionada && (
          <div className={stylesOrden.contenedorPlatillos}>
            <h3>Platillos de Orden #{ordenSeleccionada.idOrden}</h3>
            <button
              style={{ marginBottom: '10px' }}
              onClick={() => setOrdenSeleccionada(null)}
            >
              Cerrar vista
            </button>

            <ul>
              {ordenPlatillos.map((platillo) => (
                <li key={platillo.Platillo_idPlatillo} style={{ marginBottom: '10px' }}>
                  <b>{platillo.platillo}</b> - Categoría: {platillo.categoria || 'N/A'} - Precio
                  unitario: ${platillo.precioUnitario} - Cantidad: {platillo.cantidad} - Estado:{' '}
                  {platillo.estado}
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleEliminarPlatillo(platillo.Platillo_idPlatillo)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <button
              style={{
                marginTop: '15px',
                backgroundColor: 'green',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '5px'
              }}
              onClick={handleFinalizarOrden}
            >
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
                    onChange={(e) =>
                      setCantidadPlatillo({
                        ...cantidadPlatillo,
                        [platillo.idPlatillo]: e.target.value
                      })
                    }
                    style={{ width: '60px', marginLeft: '10px' }}
                  />
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => handleAgregarPlatillo(platillo.idPlatillo)}
                  >
                    Agregar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdenMesero;
