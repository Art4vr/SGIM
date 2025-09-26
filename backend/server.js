//Importar dependencias necesarias
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import conexionBD from './src/config/db.js'; //conexión a la base de datos


//Crear una instancia de la aplicacion express
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


app.listen(port,()=>{
    console.log('<Servidor escuchando en el puerto', port + '>');
    console.log('URL:', 'http://' + process.env.HOST + ':' + port);
})