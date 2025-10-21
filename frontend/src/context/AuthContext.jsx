import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

// Creamos el contexto
const AuthContext = createContext();

// Proveedor global del contexto
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserRaw = localStorage.getItem("user");
        const storedUser = storedUserRaw && storedUserRaw !== "undefined"
            ? JSON.parse(storedUserRaw)
            : null;
        if (storedUser) {
            setUser(storedUser);
            setLoading(false);
        } else {
            api
                .get("/api/auth/me")
                .then((res) => {
                    console.log("Usuario autenticado AuthContext:", res.data);
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                })
                .catch((err) => {
                    console.log("No autenticado:", err);
                    setUser(null);
                    localStorage.removeItem("user");
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const login = async (username, password) => {
        const res = await api.post("/api/auth/login", { username, password });
        setUser(res.data.user); // Actualiza inmediatamente sin esperar refresh
        localStorage.setItem("user", JSON.stringify(res.data.user));
        return res.data.user;
    };

    const logout = async () => {
        await api.post("/api/auth/logout");
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        
        <AuthContext.Provider value={{ user, setUser, loading,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
