// src/App.jsx
import React, {useEffect, useState} from 'react'
import api from './api/axiosConfig';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus componentes de auth
import Home from './screens/auth/Home';
import Login from './screens/auth/Login';
import Registro from './screens/auth/Registro';
import PanelChef from './screens/auth/PanelChef';
import Menu from './screens/public/menu';



function App() {

  const [user,setUser] = useState(null);

  useEffect(() =>{
    api.get('/api/auth/me')
    .then(res => {
      console.log('Usuario autenticado:',res.data);
      setUser(res.data);
    })
    .catch(() => {
      console.log('No autenticado:Front App.jsx');
      setUser(null);
    });
  },[]);

  return (
    
      <BrowserRouter>
      {/* Rutas de autenticación*/}
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/PanelChef" element={<PanelChef />} />
          <Route path="/NuevoUsuario" element={<Registro />} />
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Página no encontrada</h2>} />

        {/* Rutas publicas*/}
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </BrowserRouter>
  );
}


export default App;