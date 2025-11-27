import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import stylesCommon from '../styles/common/common.module.css';
import PerfilUsuario from './PerfilUsuario';
import { IoHome } from "react-icons/io5";


const Encabezado = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estados y Refs para el menú
    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    // Lógica para cerrar el menú al hacer click fuera
    useEffect(() => { 
        const handleClickOutside = (event) => {
            if(
                menuAbierto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                botonRef.current &&
                !botonRef.current.contains(event.target)
            ){
                setMenuAbierto(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuAbierto]);

    return (
        <>
            {/* === HEADER SUPERIOR === */}
            <div className={stylesCommon.header}>
                <button ref={botonRef} className={stylesCommon.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <h1>Sistema de Gestión de Inventarios y Menús para Restaurante de Sushi</h1>
                
                <div className={stylesCommon.headerRight}>
                    <PerfilUsuario /> 
                    <img className={stylesCommon.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
                </div>
            </div>

            {/* === MENÚ LATERAL (SIDEBAR) === */}
            <div ref={menuRef} className={`${stylesCommon.sidebar} ${menuAbierto ? stylesCommon.sidebarAbierto : ''}`}>
                <ul>
                    {/* OPCIONES PARA GERENTE (Rol 1) */}
                    {user?.rol === 1 && (
                        <>  
                            <li onClick={() => navigate('/panelGerente')}><IoHome className="sidebarIcon" />Principal</li>
                            <li onClick={() => navigate('/usuarios')}>Usuarios</li>
                            <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                            <li onClick={() => navigate('/inventario')}>Inventario</li>
                            <li onClick={() => navigate('/platillos')}>Platillos</li>
                            <li onClick={() => navigate('/reportes')}>Reportes</li>
                            <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                        </>
                    )}
                    
                    {/* OPCIONES PARA ENCARGADO DE INVENTARIO (Rol 2) */}
                    {user?.rol=== 2 && (
                        <>  
                            <li onClick={() => navigate('/panelInventario')}><IoHome className="sidebarIcon" />Principal</li>
                            <li onClick={() => navigate('/proveedores')}>Proveedores</li>
                            <li onClick={() => navigate('/inventario')}>Inventario</li>
                            <li onClick={() => navigate('/actualizarStock')}>Actualizar Stock</li>
                            <li onClick={() => navigate('/productos')}>Productos</li>
                            <li onClick={() => navigate('/imprevistos')}>Imprevistos</li>
                        </>
                    )}

                    {/* OPCIONES PARA EL CHEF (Rol 3) */}
                    {user?.rol === 3 &&(
                        <>
                            <li onClick={() => navigate('/panelChef')}><IoHome className="sidebarIcon" />Principal</li>
                            <li onClick={() => navigate('/ordenChef')}>Órdenes</li>
                            <li onClick={() => navigate('/platillos')}>Platillos</li>
                            <li onClick={() => navigate('/RegistroImprevisto')}>Imprevistos</li>
                        </>
                    )}

                    {/* OPCIONES PARA MESERO (Rol 4) */}
                    {user?.rol === 4 && (
                        <>  
                            <li onClick={() => navigate('/panelMesero')}><IoHome className="sidebarIcon" />Principal</li>
                            <li onClick={() => navigate('/OrdenesMesero')}>Órdenes Mesero</li>
                            <li onClick={() => navigate('/platillos')}>Platillos</li>
                            <li onClick={() => navigate('/VerMenu')}>Ver Menú</li>
                            <li onClick={() => navigate('/RegistroImprevistoMesero')}>Imprevistos</li>

                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Encabezado;