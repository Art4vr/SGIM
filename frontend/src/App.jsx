// src/App.jsx
import React, {useEffect, useState} from 'react'
import api from './api/axiosConfig';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

// Importa tus componentes de auth
import Home from './screens/auth/Home';
import Login from './screens/auth/Login';
import Registro from './screens/auth/Registro';
import PanelChef from './screens/auth/PanelChef';
import Menu from './screens/public/menu';
import RegistroImprevisto from './screens/imprevistos/registroImprevisto';

//Importacion de mi vista de productos (borrar)
import VistaProductos from './screens/productos/vistaProducto';


function App() {
  
  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(true); // NUEVO

  console.log('USER APP.JSX', user);

  useEffect(() =>{
    api.get('/api/auth/me')
    .then(res => {
      console.log('Usuario autenticado:',res.data);
      setUser(res.data);//guarda los datos del usuario autenticado
    })
    .catch(() => {
      console.log('No autenticado:Front App.jsx');
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
  },[]);

    // 🔄 Mientras carga, muestra algo o simplemente nada
  if (loading) {
    return <div>Cargando usuario...</div>;
  }

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/PanelChef" element={<PanelChef />} />
          <Route path="/NuevoUsuario" element={<Registro />} />

          <Route path="/Productos" element={<VistaProductos />} />

          <Route 
            path="/RegistroImprevisto" 
            element={
              <ProtectedRoute user={user} allowedRoles={[3]}>
                <RegistroImprevisto />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/PanelChef" 
            element={
              <ProtectedRoute user={user} allowedRoles={[3]}>
                <PanelChef />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/NuevoUsuario" 
            element={
              <ProtectedRoute user={user} allowedRoles={[1]}>
                <Registro />
              </ProtectedRoute>
            }
          />
          <Route path="/Menu" element={<Menu />} />
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>Página no encontrada</h2>} />    
        </Routes>
      </BrowserRouter>
  );
}


export default App;