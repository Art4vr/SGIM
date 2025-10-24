// src/screens/public/Menu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/public/Menu.css";

export default function Menu() {
  const [platillos, setPlatillos] = useState({});
  const [categorias, setCategorias] = useState([]); // 🔹 Lista de categorías
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      // 🔹 Usa la IP local de tu PC si pruebas desde móvil
      .get("http://172.20.2.67:3000/api/platillos")
      .then((res) => {
        // Agrupar platillos por categoría
        const agrupados = res.data.reduce((acc, platillo) => {
          if (!acc[platillo.categoria]) acc[platillo.categoria] = [];
          acc[platillo.categoria].push(platillo);
          return acc;
        }, {});

        setPlatillos(agrupados);
        setCategorias(["Todas", ...Object.keys(agrupados)]); // lista de categorías + "Todas"
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando platillos:", err));
  }, []);

  if (loading) return <p className="loading">Cargando menú...</p>;

  // 🔹 Filtrado por categoría y búsqueda
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

  return (
    <div
      className="menu-background"
      style={{
        backgroundImage: "url('/imagenes/FondoMK.PNG')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="menu-panel">
        {/* 🔍 Barra de búsqueda y filtro */}
        <div className="menu-filtros">
          <input
            type="text"
            placeholder="Buscar platillo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="menu-busqueda"
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="menu-select"
          >
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 📋 Lista de categorías */}
        <div className="menu-list">
          {Object.keys(platillosFiltrados).length === 0 ? (
            <p className="no-result">No se encontraron platillos.</p>
          ) : (
            Object.keys(platillosFiltrados).map((categoria) => (
              <div className="menu-category" key={categoria}>
                <h2 className="category-title">{categoria}</h2>
                {platillosFiltrados[categoria].map((p) => (
                  <div className="menu-item" key={p.id}>
                    <div className="menu-img">
                      <img src={`/imagenes/${p.imagen}`} alt={p.nombre} />
                    </div>
                    <div className="menu-info">
                      <div className="menu-header">
                        <h3>{p.nombre}</h3>
                        <span className="menu-price">${p.precio}</span>
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
