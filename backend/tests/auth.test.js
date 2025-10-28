import request from "supertest";
import app from "../server.js";

describe('🧪 Pruebas de autenticación', () => {

    test('Debe fallar al acceder sin token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toMatch(/No autorizado/i);
    });

    test('Debe permitir login correcto', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'endira_c', password: '12345' });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toHaveProperty('username', 'endira_c');
        expect(res.body.user).toHaveProperty('rol');
    });

});
