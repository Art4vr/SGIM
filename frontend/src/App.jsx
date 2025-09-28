// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus componentes de auth
import Home from './screens/auth/Home';
import Login from './screens/auth/Login';
import Registro from './screens/auth/Registro';
import NuevoUsuario from './screens/auth/nuevoUsuario';

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/nuevoUsuario" element={<NuevoUsuario />} />
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Página no encontrada</h2>} />
        </Routes>
      </BrowserRouter>
  );
}


export default App;