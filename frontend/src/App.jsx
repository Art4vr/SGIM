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
import MostrarImprevistos from './screens/imprevistos/mostrarImprevistos';

//Importacion de vista productos
import VistaProductos from './screens/productos/vistaProducto';

//Importacion de proveedores 
import VistaProveedores from './screens/proveedores/vistaProveedor';

//Importacion de platillos
import VistaPlatillos from './screens/platillos/platillos';

//Importación de ordenes de chef
import OrdenChef from './screens/ordenes/ordenChef';

//Importación de los platillos de chef
import PlatillosChef from './screens/platillos/platillosChef';

function App() {
  
  const {user,loading} = useAuth();

  console.log('USER APP.JSX', user);
  if (loading) return <div>Cargando sesión...</div>;
  
//revisar ruta de productos y proveedores (permisos o roles correspondientes)
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Home />} />
          
          <Route path="/Productos" element={
            <ProtectedRoute user={user} allowedRoles={[1,2]}>
              <VistaProductos />
            </ProtectedRoute>
            } 
          />

          <Route path="/Platillos" element={
            <ProtectedRoute user={user} allowedRoles={[1,3,4]}>
              <VistaPlatillos />
            </ProtectedRoute>
            } 
          />

          <Route path="/Imprevistos" element={
            <ProtectedRoute user={user} allowedRoles={[1,2]}>
              <MostrarImprevistos />
            </ProtectedRoute>
            } 
          />

          <Route path="/Proveedores" element={<VistaProveedores />} />

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
            path="/ordenChef" 
            element={
              <ProtectedRoute user={user} allowedRoles={[3]}>
                <OrdenChef />
              </ProtectedRoute>
            }
          />
            <Route 
            path="/platillosChef" 
            element={
              <ProtectedRoute user={user} allowedRoles={[3]}>
                <PlatillosChef />
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