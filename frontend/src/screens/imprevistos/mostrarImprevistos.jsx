import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import styles from '../../styles/imprevistos/imprevistos.module.css';
import api from '../../api/axiosConfig';
import stylesCommon from '../../styles/common/common.module.css';

import { getProductos } from '../../api/productoApi';

const MostrarImprevistos = () => {
  const { logout, loading } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [inventarios, setInventarios] = useState([]);

  const [imprevistos, setImprevistos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('');

  const menuRef = useRef(null);
  const botonRef = useRef(null);

  const cargarImprevistos = async () => {
    setCargando(true);
    try {
      const response = await api.get('/api/imprevistos/listar');
      setImprevistos(response.data.resultados || []);
      setMensaje('');
    } catch (err) {
      setMensaje('Error al cargar imprevistos-cargarImprevistos');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const productosRes = await getProductos();
      setProductos(productosRes.data || []);
    } catch (err) {
      setMensaje('Error al cargar datos-cargarDatos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarImprevistos();
    cargarDatos();
  }, []);

  const handleNombreProducto = (e) => {
    const idProductoImprevisto = Number(e.target.value);
    setIdProducto(idProductoImprevisto);

    const productoInventario = inventarios.find(
      (pi) => pi.Producto_idProducto === idProductoImprevisto
    );
    const ProductoEquivalente = productos.find((p) => p.idProducto === idProductoImprevisto);

    if (productoInventario && ProductoEquivalente) {
      setNombreProducto(ProductoEquivalente.nombre);
    } else {
      setNombreProducto('');
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (busqueda.trim() === '' && filtro.trim() === '') {
      cargarImprevistos();
      return;
    }

    setCargando(true);
    try {
      const response = await api.get('/api/imprevistos/listar', {
        params: { filtro, busqueda },
      });
      setImprevistos(response.data.resultados || []);
      setMensaje(response.data.resultados?.length === 0 ? 'No se encontraron resultados -handleBuscar' : '');
    } catch (err) {
      setMensaje('Error al realizar la búsqueda-handleBuscar');
    } finally {
      setCargando(false);
    }
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuAbierto]);

  if (loading) return <div>Cargando usuario...</div>;

  const toggleMenu = () => setMenuAbierto((s) => !s);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className={stylesCommon.bodyContainer}>
      {/* Header */}
      <div className={stylesCommon.header}>
        <button
          ref={botonRef}
          className={stylesCommon.menuBoton}
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <img src="/imagenes/menu_btn.png" alt="Menú" />
        </button>

        <h1 className={stylesCommon.headerTitle}>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi</h1>

        <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
      </div>

      {/* Sidebar */}
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

      {/* Contenedor principal */}
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <h2 className={styles.title}>Lista de Imprevistos</h2>

          {/* filtros */}
          <div className={styles.filterRow}>
            <select value={filtro} onChange={handleFiltroChange} className={styles.busqueda}>
              <option value="">Seleccionar Filtro</option>
              <option value="estado">Estado</option>
              <option value="fecha">Fecha de Registro</option>
              <option value="InventarioProducto_idInventarioProducto">Producto</option>
              <option value="Usuario_idUsuarioReporta">Usuario que Reportó</option>
              <option value="Usuario_idUsuarioAutoriza">Usuario que Autorizó</option>
            </select>

            <form onSubmit={handleBuscar} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={styles.busqueda}
              />
              <button type="submit" className={stylesCommon.registerBtn} disabled={cargando}>
                {cargando ? <ClipLoader size={18} color="#fff" /> : 'Buscar'}
              </button>
            </form>
          </div>

          {mensaje && <p className={stylesCommon.message}>{mensaje}</p>}

          {/* Tabla */}
          <div className={stylesCommon.tableWrapper}>
            {cargando ? (
              <div style={{ padding: 20 }}><ClipLoader size={30} color="#000" /></div>
            ) : (
              <table className={styles.Table || ''}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Reportado por</th>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Aprobado por</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {imprevistos.length > 0 ? (
                    imprevistos.map((imp) => (
                      <tr key={imp.idImprevisto}>
                        <td>{imp.idImprevisto}</td>
                        <td>{imp.Usuario_idUsuarioReporta}</td>
                        <td>{imp.InventarioProducto_idInventarioProducto}</td>
                        <td>{imp.descripcion}</td>
                        <td>{imp.cantidad}</td>
                        <td>{imp.UnidadMedida_idUnidadMedida}</td>
                        <td>{imp.Usuario_idUsuarioAutoriza}</td>
                        <td>{imp.fecha ? format(new Date(imp.fecha), 'dd/MM/yyyy HH:mm:ss') : ''}</td>
                        <td>{imp.estado}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center' }}>
                        No hay imprevistos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Back button */}
          <button className={stylesCommon.backBtn} onClick={() => navigate('/PanelGerente')}>
            VOLVER AL INICIO
          </button>
        </div>
      </div>
    </div>
  );
};

export default MostrarImprevistos;
