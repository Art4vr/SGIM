// Importa el componente Navigate para redireccionar a otra ruta desde el código
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


// Recibe tres props:
// - user: objeto con la información del usuario (como su rol, nombre, etc.)
// - allowedRoles: array de roles permitidos para acceder a esta ruta (opcional)
// - children: el contenido (componente) que se debe mostrar si el acceso es válido
const ProtectedRoute = ({user,allowedRoles,children}) => {
    //console.log('Datos ProtectedRoute ALOWED ROLES:',allowedRoles);
    //console.log('Datos ProtectedRoute USER:',user);
    //console.log('ROLES protected route: ', allowedRoles.includes(user.rol));

    const { loading } = useAuth();

    // 🔹 Mientras se verifica la sesión, muestra pantalla de carga
    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Verificando sesión...</div>;
    }
    
    if(!user){// Si no hay usuario autenticado, lo redirige al login
        return <Navigate to="/Login" replace />;
    }

    // Si se pasan roles permitidos (allowedRoles),y el rol del usuario NO está incluido en esa lista,muestra un mensaje de "Acceso denegado"
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Acceso denegado</h2>;
    }

    // Si el usuario está autenticado y tiene el rol permitido (o no se especificaron roles),
    // muestra el contenido protegido (children)
    return children;
};

export default ProtectedRoute;