const request = require('supertest');
const app = require('../src/app');

describe('Todo API', () => {

    it('GET /todos should return array', async () => {
        const res = await request(app).get('/todos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /todos should create todo', async () => {
        const res = await request(app)
            .post('/todos')
            .send({ title: "Test Todo" });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("Test Todo");
    });

    it('POST /todos without title should fail', async () => {
        const res = await request(app)
            .post('/todos')
            .send({});

        expect(res.statusCode).toBe(400);
    });

});