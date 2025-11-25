import api from '../../api/axiosConfig';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
//import styles from '../../styles/platillos/PlatillosChef.module.css';
import Encabezado from '../../components/Encabezado';

const PlatillosChef = () => {
    const navigate = useNavigate();

    return(
        <div className=''>
            {/* Encabezado */}
            <Encabezado/>

        </div>
    );
};

export default PlatillosChef;