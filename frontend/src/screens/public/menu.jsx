import React from "react";
import "../../styles/public/Menu.css";


export default function Menu() {
  const today = new Date().getDay();

  // Menú base
  const productos = [
    { id: 1, nombre: "Sushi Especial", precio: "$120", desc: "Arroz, salmón, aguacate fresco." },
    { id: 2, nombre: "Rollo California", precio: "$95", desc: "Cangrejo, aguacate, pepino, ajonjolí." },
    { id: 3, nombre: "Nigiri Salmón", precio: "$70", desc: "Salmón fresco sobre arroz sazonado." },
    { id: 4, nombre: "Rollo Tempura", precio: "$110", desc: "Camarón tempura con queso crema." },
    { id: 5, nombre: "Rollo Dragón", precio: "$125", desc: "Anguila, aguacate y salsa especial." },
  ];

  // Si es sábado o domingo, agregamos Buffet al inicio
  if (today === 0 || today === 6) {
    productos.unshift({
      id: 99,
      nombre: "Buffet Especial Fin de Semana 🎉",
      precio: "$250",
      desc: "Disfruta de todos nuestros platillos en modalidad buffet.",
      destacado: true,
    });
  }

  return (
    <div className="menu-background"
    style={{
    backgroundImage: "url('/imagenes/FondoMK.PNG')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    }}>
      <div className="menu-panel">
        <div className="menu-list">
          {productos.map((p) => (
            <div
              key={p.id}
              className={`menu-item ${p.destacado ? "buffet-item" : ""}`}
            >
              <div className="menu-img">
                <img src="/placeholder.jpg" alt={p.nombre} />
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
