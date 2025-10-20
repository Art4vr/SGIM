// src/App.jsx
import React, {useEffect, useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
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
  
  const {user,loading} = useAuth();

  console.log('USER APP.JSX', user);
  if (loading) return <div>Cargando sesión...</div>;
  
//revisar ruta de productos (permisos o roles correspondientes)
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          
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
