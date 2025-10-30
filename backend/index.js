// index.js
import app from './server.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`<Servidor escuchando en el puerto ${PORT}>`);
    console.log('URL:', process.env.FRONTEND_URL);
});
