// src/App.jsx
import React, {useEffect, useState} from 'react'
import api from './api/axiosConfig';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus componentes de auth
import Home from './screens/auth/Home';
import Login from './screens/auth/Login';
import Registro from './screens/auth/Registro';
import Panel from './screens/auth/Panel';

//Importacion de mi vista de productos (borrar)
import VistaProductos from './screens/productos/vistaProducto';


function App() {

  const [user,setUser] = useState(null);

  useEffect(() =>{
    api.get('/api/auth/me')
    .then(res => {
      console.log('Usuario autenticado:',res.data);
      setUser(res.data);
    })
    .catch(() => {
      console.log('No autenticado');
      setUser(null);
    });
  },[]);

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/Panel" element={<Panel />} />
          <Route path="/NuevoUsuario" element={<Registro />} />

          <Route path="/Productos" element={<VistaProductos />} />
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Página no encontrada</h2>} />
          
        </Routes>
      </BrowserRouter>
  );
}


export default App;