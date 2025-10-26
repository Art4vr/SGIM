// src/screens/public/Menu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/public/Menu.module.css";

export default function Menu() {
  const [platillos, setPlatillos] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:3000/api/platillos")
      .then((res) => {
        const agrupados = res.data.reduce((acc, platillo) => {
          if (!acc[platillo.categoria]) acc[platillo.categoria] = [];
          acc[platillo.categoria].push(platillo);
          return acc;
        }, {});

        setPlatillos(agrupados);
        setCategorias(["Todas", ...Object.keys(agrupados)]);
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando platillos:", err));
  }, []);

  const filtrarPlatillos = () => {
    const resultado = {};
    Object.keys(platillos).forEach((cat) => {
      if (filtroCategoria !== "Todas" && cat !== filtroCategoria) return;
      const filtrados = platillos[cat].filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
      if (filtrados.length > 0) resultado[cat] = filtrados;
    });
    return resultado;
  };

  const platillosFiltrados = filtrarPlatillos();

  if (loading) return <p className={styles.loading}>Cargando menú...</p>;

  return (
    <div className={styles.menuContainer}>
      {/* Panel principal */}
      <div className={styles.menuPanel}>
        {/* Filtros */}
        <div className={styles.menuFiltros}>
          <input
            type="text"
            placeholder="Buscar platillo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.menuBusqueda}
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={styles.menuSelect}
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de platillos */}
        <div className={styles.menuList}>
          {Object.keys(platillosFiltrados).length === 0 ? (
            <p className={styles.noResult}>No se encontraron platillos.</p>
          ) : (
            Object.keys(platillosFiltrados).map((categoria) => (
              <div className={styles.menuCategory} key={categoria}>
                <h2 className={styles.categoryTitle}>{categoria}</h2>
                {platillosFiltrados[categoria].map((p) => (
                  <div className={styles.menuItem} key={p.id}>
                    <div className={styles.menuImg}>
                      <img src={`/imagenes/${p.imagen}`} alt={p.nombre} />
                    </div>
                    <div className={styles.menuInfo}>
                      <div className={styles.menuHeaderItem}>
                        <h3>{p.nombre}</h3>
                        <span className={styles.menuPrice}>${p.precio}</span>
                      </div>
                      <p>{p.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
