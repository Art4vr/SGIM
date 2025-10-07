//Importar dependencias necesarias
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import conexionBD from './src/config/db.js'; //conexión a la base de datos
import router from './src/Routes/rutas.js';


//Crear una instancia de la aplicacion express
const app = express();

app.use(helmet());//cabeceras HTTP seguras
app.use(cookieParser());//va a analizar las cookies en las solicitudes y hacerlas accesibles desde `req.cookies`

app.use(express.json());
app.use(cors({ //Habilitar CORS (Cross-Origin Resource Sharing) para permitir solicitudes de otros dominios
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:3000', // Permite solicitudes solo desde el frontend especificado
    credentials: true // Permite el envío de cookies con las solicitudes
}));

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //equivale a 15 minutos
    max: 500 // Número máximo de peticiones permitidas en esos 15 minutos
});
app.use(globalLimiter);


const PORT = process.env.PORT || 5000;

//aqui se define el prefijo para las rutas
app.use('/api',router);

app.listen(PORT,()=>{
    console.log('<Servidor escuchando en el puerto', PORT + '>');
    console.log('URL:', process.env.FRONTEND_URL );
})