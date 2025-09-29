import React from "react";
import "../../styles/public/Menu.css";
import "../../imagenes/FondoMK.PNG";

export default function Menu() {
  const productos = [
    { id: 1, nombre: "Sushi Especial", precio: "$120", desc: "Arroz, salmón, aguacateArroz, salmón, aguacateArroz, salmón, aguacateArroz, salmón, aguacateArroz, salmón, aguacate" },
    { id: 2, nombre: "Rollo California", precio: "$95", desc: "Cangrejo, aguacate, pepino" },
    { id: 3, nombre: "Nigiri Salmón", precio: "$70", desc: "Salmón fresco sobre arroz" },
    { id: 4, nombre: "Rollo Tempura", precio: "$110", desc: "Camaron tempura, queso crema" },
    { id: 4, nombre: "Rollo Tempura", precio: "$110", desc: "Camaron tempura, queso crema" },
    { id: 4, nombre: "Rollo Tempura", precio: "$110", desc: "Camaron tempura, queso crema" }
    // agrega más platillos para probar el scroll
  ];

  return (
    <div className="menu-background">
      <div className="menu-panel">
        <div className="menu-list">
          {productos.map((p) => (
            <div className="menu-item" key={p.id}>
              <div className="menu-img">
                {/* Aquí pon la imagen del producto */}
                <img src="/placeholder.jpg" alt="Producto" />
              </div>
              <div className="menu-info">
                <div className="menu-header">
                  <h3>{p.nombre}</h3>
                  <span className="menu-price">{p.precio}</span>
                </div>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
