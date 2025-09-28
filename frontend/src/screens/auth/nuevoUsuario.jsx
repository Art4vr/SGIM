//pantalla para crear un nuevo usuario (registro)
import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';


function NuevoUsuario(){

    const [nombre,setNombre] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [estado,setEstado] = useState('');
    const [rol,setRol] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/crearUsuario',{
            nombre,
            username,
            password,
            estado,
            rol
        })
        .then((res)=>{
            navigate('/')
            console.log(res)
        })
        .catch((err)=>console.log(err))

    }


    return(
        <div name="contenedorNuevoUsuario">
            <div name="formularioNuevoUsuario">
                <h2>Crear Usuario</h2>
                <form onSubmit={handleSubmit}>
                    <div name="campoFormulario">
                        <label htmlFor="nombre">Nombre</label>
                        <input placeholder='Ingresar nombre' name="nombre" type="text" onChange={(e) => setNombre(e.target.value)}/>
                    </div>
                    <div name="campoFormulario">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <input placeholder="Ingrese username" name="username" type="text" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div name="campoFormulario">
                        <label htmlFor="password">Contraseña</label>
                        <input placeholder="Ingrese contraseña" name="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div name="campoFormulario">
                        <label htmlFor="estado">Estado</label>
                        <input placeholder="Activo, Inactivo" name="estado" type="text" onChange={(e) => setEstado(e.target.value)} />
                    </div>
                    <div name="campoFormulario">
                        <label htmlFor="rol">Rol</label>
                        <input placeholder='Chef|Mesero|Gerente|EncargadoInventario' name="rol" type="number" onChange={(e) => setRol(e.target.value)} />
                    </div>
                    <button type="submit">Crear Usuario</button>
                </form>
            </div>
        </div>
    )
}

export default NuevoUsuario;