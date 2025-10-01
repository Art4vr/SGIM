import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Panel = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.post('/api/auth/logout');
        navigate('/');
    };

    return (
    <div>
        <h1>Bienvenido</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default Panel;