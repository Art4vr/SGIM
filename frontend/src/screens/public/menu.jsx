// src/screens/public/Menu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/public/Menu.css";

export default function Menu() {
  const [platillos, setPlatillos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      // 🔹 Usa la IP de tu PC si vas a acceder desde el móvil
      .get("http://127.0.0.1:3000/api/platillos")
      .then((res) => {
        // Agrupa los platillos por categoría
        const agrupados = res.data.reduce((acc, platillo) => {
          if (!acc[platillo.categoria]) {
            acc[platillo.categoria] = [];
          }
          acc[platillo.categoria].push(platillo);
          return acc;
        }, {});
        setPlatillos(agrupados);
        setLoading(false);
      })
      .catch((err) => console.error("Error cargando platillos:", err));
  }, []);

  if (loading) return <p className="loading">Cargando menú...</p>;

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
        <div className="menu-list">
          {/* Recorre las categorías dinámicamente */}
          {Object.keys(platillos).map((categoria) => (
            <div className="menu-category" key={categoria}>
              <h2 className="category-title">{categoria}</h2>
              {platillos[categoria].map((p) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
