// src/scripts/hash_existing_passwords.js
import conexionDB from '../config/db.js';
import bcrypt from 'bcrypt';

const run = async () => {
    try {
        const [rows] = await conexionDB.execute('SELECT idUsuario, password FROM Usuario');
        console.log(`Usuarios a revisar: ${rows.length}`);
        
        for (const row of rows) {
            const { idUsuario, password } = row;
            
            // Si ya parece un hash bcrypt, lo omitimos:
            // bcrypt hashes empiezan con $2b$ o $2a$ o $2y$
            if (typeof password === 'string' && /^\$2[aby]\$/.test(password)) {
                console.log(`id ${idUsuario}: ya hasheado — omito`);
                continue;
            }   
            
            //   Si password es null o vacío saltearlo
            if   (!password) {
                console.log(`id ${idUsuario}: password vacío — omito`);
                continue;
            }

            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds);
            await conexionDB.execute('UPDATE Usuario SET password = ? WHERE idUsuario = ?', [hash, idUsuario]);
            console.log(`id ${idUsuario}: actualizado a hash`);
        }

        console.log('Migración finalizada');
        process.exit(0);
    }   catch (err) {
        console.error('Error en migración:', err);
        process.exit(1);
    }
};

run();
