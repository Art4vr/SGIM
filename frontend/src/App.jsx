// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';

// Importa tus componentes de auth
import Home from './screens/auth/Home';
import Login from './screens/auth/Login';
import Registro from './screens/auth/Registro';

function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Página no encontrada</h2>} />
        </Routes>
      </Router>
  );
}


export default App;