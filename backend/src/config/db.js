//Configuracion  para la conexión con la base de datos
import mysql from 'mysql2/promise';
import 'dotenv/config'; // Cargar variables de entorno

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const conn = await pool.getConnection();
        await conn.ping();
        conn.release();
        console.log('✅ Conexión a la base de datos verificada');
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
    }
})();


export default pool;