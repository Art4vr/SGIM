//Importar dependencias necesarias
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import conexionBD from './src/config/db.js'; //conexión a la base de datos
import router from './src/Routes/rutas.js';


//Crear una instancia de la aplicacion express
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use('/api', router);

app.listen(PORT,()=>{
    console.log('<Servidor escuchando en el puerto', PORT + '>');
    console.log('URL:', 'http://' + process.env.HOST + ':' + PORT);
})