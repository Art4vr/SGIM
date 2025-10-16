import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

// Creamos el contexto
const AuthContext = createContext();

// Proveedor global del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/api/auth/me")
            .then((res) => {
                console.log("Usuario autenticado AuthContext:", res.data);
                setUser(res.data);
            })
            .catch((err) => {
                console.log("No autenticado:", err);
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
