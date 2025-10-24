import api from '../../api/axiosConfig';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/meseros/MeseroPanel.module.css';

const MeseroPanel = () => {
    const navigate = useNavigate();

    const [menuAbierto, setMenuAbierto] = useState(false);
    const [pedido, setPedido] = useState([]);

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
    };

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    // Menú por categorías
    const menu = {
        Sushis: [
            { id: 1, nombre: "Avocado Maki", precio: 110 },
            { id: 2, nombre: "California Roll", precio: 130 },
            { id: 3, nombre: "Tako Maki", precio: 125 },
            { id: 4, nombre: "MK Roll", precio: 140 },
        ],
        Postres: [
            { id: 5, nombre: "Brownie de Chocolate", precio: 85 },
            { id: 6, nombre: "Helado Tempura", precio: 95 },
            { id: 7, nombre: "Copa de Helado", precio: 75 },
        ],
        Bebidas: [
            { id: 8, nombre: "Cerveza", precio: 55 },
            { id: 9, nombre: "Agua de Limón", precio: 35 },
            { id: 10, nombre: "Refresco", precio: 40 },
        ],
    };

    const agregarItem = (item) => {
        const existe = pedido.find(p => p.id === item.id);
        if (existe) {
            setPedido(
                pedido.map(p =>
                    p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
                )
            );
        } else {
            setPedido([...pedido, { ...item, cantidad: 1 }]);
        }
    };

    const eliminarItem = (id) => {
        setPedido(pedido.filter(p => p.id !== id));
    };

    const finalizarPedido = () => {
        if (pedido.length === 0) return alert("No hay ítems en el pedido.");
        alert(`Pedido finalizado. Total: $${pedido.reduce((acc, item) => acc + item.precio * item.cantidad, 0)}`);
        setPedido([]);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <button className={styles.menuBoton} onClick={toggleMenu}>
                    <img src="/imagenes/menu_btn.png" alt="Menú" />
                </button>
                <img className={styles.logo} src="/imagenes/MKSF.png" alt="LogoMK" />
            </div>

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${menuAbierto ? styles.sidebarAbierto : ''}`}>
                <ul>
                    <li onClick={() => navigate('/Perfil')}>Perfil</li>
                    <li onClick={() => navigate('/RegistrarPedido')}>Registrar Pedido</li>
                    <li onClick={() => navigate('/VerMenu')}>Ver Menú</li>
                    <li onClick={handleLogout}>Log Out</li>
                </ul>
            </div>

            {/* Contenido principal */}
            <div className={styles.contenido}>
                {/* Registrar Pedido */}
                <button className={styles.tarjetas} onClick={() => navigate('/RegistrarPedido')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/registrar_pedido.png" alt="Registrar Pedido" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Registrar Pedido</h3>
                    </div>
                </button>

                {/* Ver Menú */}
                <button className={styles.tarjetas} onClick={() => navigate('/VerMenu')}>
                    <div>
                        <img className={styles.imagenMenu} src="/imagenes/ver_menu.png" alt="Ver Menú" />
                    </div>
                    <div className={styles.nombreMenu}>
                        <h3>Ver Menú</h3>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default MeseroPanel;
