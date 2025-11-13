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
  modificarOrden,
  enviarOrdenACocina,
} from '../../api/ordenMeseroApi';
// Es para modificar los estados de los platillos
import { actualizarPlatilloChef } from '../../api/chefApi';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/ordenes/orden.module.css';
import stylesCommon from '../../styles/common/common.module.css';
// Para importar el usuario
import PerfilUsuario from '../../components/PerfilUsuario';


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
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const botonRef = useRef(null);

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

  //Actualizacion 4 seg 
  useEffect(() => {
    if (!ordenSeleccionada) return;
    const interval = setInterval(async () => {
      try {
        const response = await getPlatillosOrden(ordenSeleccionada.idOrden);
        setOrdenPlatillos(response.data);
      } catch (error) {
        console.error("Error actualizando platillos en tiempo real:", error);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [ordenSeleccionada]);

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

    //Refresh detalle y lista de órdenes
    await seleccionarOrden(ordenSeleccionada);
    await cargarOrdenes();

    // Reiniciar cantidad
    setCantidadPlatillo({ ...cantidadPlatillo, [platilloId]: 1 });

  } catch (err) {
    console.error('Error al agregar platillo:', err);
    alert('No se pudo agregar el platillo a la orden');
  }
};

// ---------------------- ELIMINAR PLATILLO ----------------------
const handleEliminarPlatillo = async (idPlatilloOrden) => {
  if (!ordenSeleccionada) return;
  try {
    await eliminarPlatilloOrden(idPlatilloOrden);
    alert('Platillo eliminado correctamente');

    //Refrescar detalle y lista de órdenes
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

// ---------------------- ENVIAR A COCINA ----------------------
const handleEnviarCocina = async () => {
  if (!ordenSeleccionada) return alert('Selecciona una orden primero');
  
  try {
    // Cambia estado general a "en cocina"
    await enviarOrdenACocina(ordenSeleccionada.idOrden);
    alert(`Orden #${ordenSeleccionada.idOrden} enviada a cocina`);
    
    // Refresca la vista
    await cargarOrdenes();
    setVista('ordenes');
    setOrdenSeleccionada(null);
  } catch (err) {
    console.error('Error al enviar a cocina:', err);
    alert('No se pudo enviar la orden a cocina');
  }
};

// ---------------------- CAMBIAR ESTADO DE PLATILLO ----------------------
const cambiarEstado = async (platillo, nuevoEstado) => {
        try {
        await actualizarPlatilloChef({
            idPlatilloOrden: platillo.idPlatilloOrden,
            estado: nuevoEstado
        });
        await cargarPlatillos();
        } catch (error) {
        console.error('Error al actualizar estado del platillo:', error);
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
  // --------------------- Menu y header -----------------
    const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
    };

  useEffect(() => { 
    const handleClickOutside = (event) =>{
      if(
        menuAbierto &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        botonRef.current &&
        !botonRef.current.contains(event.target)
      ){
        setMenuAbierto(false);
      }
    }
    document.addEventListener('mousedown',handleClickOutside);
    return () => {
      document.removeEventListener('mousedown',handleClickOutside);
    };
  }, [menuAbierto]);

  
// ---------------------- RENDER ----------------------
  return (

  <div className={styles.container}>
        {/* Encabezado */}
        <div className={stylesCommon.header}>
          <button ref ={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
            <img src="/imagenes/menu_btn.png" alt="Menú" />
          </button>
          <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi </h1>
          {/* ESTA ES LA PARTE CLAVE (Derecha) */}
          <div className={stylesCommon.headerRight}>
            <PerfilUsuario /> 
            <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" /> {}
          </div>
        </div>

      <div className={styles.contenidoPrincipal}>
              {/* Menú lateral */}
              <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                  <ul>

                  </ul>
              </div>

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
                    <br />
                    <span>Estado: <b>{p.estado}</b></span>

                    {/* Mostrar botón [entregado] solo si está "listo" el platillo*/}
                    {p.estado === 'listo' && (
                      <button onClick={() => cambiarEstado(p, 'entregado')} className={styles.botonAccion}>
                        Entregado
                      </button>
                    )}

                    {/* Eliminar solo si aún no se envió a cocina */}
                    {p.estado === 'pendiente' && (
                      <button
                        onClick={() => handleEliminarPlatillo(p.idPlatilloOrden)}
                        style={{ marginLeft: '10px' }}
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>

            <div style={{ marginTop: '15px' }}>
              <button onClick={() => setVista('agregar')}>Agregar Platillos</button>
              <button onClick={handleEnviarCocina}>Enviar a Cocina</button>
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
    </div>
  );
};

export default OrdenMesero;
