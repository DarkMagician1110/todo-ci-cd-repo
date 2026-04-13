const request = require('supertest');
const app = require('../src/app');

describe('🚀 Todo API Integration Tests', () => {

    // Test GET: Lấy danh sách
    it('GET /todos - Phải trả về mảng danh sách (Status 200)', async () => {
        const res = await request(app).get('/todos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test POST: Tạo mới thành công
    it('POST /todos - Phải tạo được todo mới khi dữ liệu hợp lệ (Status 201)', async () => {
        const newTask = { title: "Học CI/CD với Gemini" };
        const res = await request(app)
            .post('/todos')
            .send(newTask);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe(newTask.title);
    });

    // Test POST: Lỗi validation
    it('POST /todos - Phải báo lỗi 400 nếu gửi title rỗng', async () => {
        const res = await request(app)
            .post('/todos')
            .send({ title: "" });

        expect(res.statusCode).toBe(400);
    });

    // Test DELETE: Xóa công việc
    it('DELETE /todos/:id - Phải xóa thành công hoặc báo lỗi 404 nếu sai ID', async () => {
        // Tạo thử một task để lấy ID
        const temp = await request(app).post('/todos').send({ title: "Task để xóa" });
        const id = temp.body.id;

        // Tiến hành xóa
        const res = await request(app).delete(`/todos/${id}`);
        expect(res.statusCode).toBe(200);

        // Kiểm tra lại xem đã mất chưa
        const check = await request(app).get('/todos');
        const exists = check.body.find(t => t.id === id);
        expect(exists).toBeUndefined();
    });

    it('Integration: Luồng thêm mới và xóa phải nhất quán', async () => {
        // 1. Lấy số lượng ban đầu
        const listBefore = await request(app).get('/todos');
        const countBefore = listBefore.body.length;

        // 2. Thêm mới
        const newTodo = await request(app).post('/todos').send({ title: "Task tạm" });

        // 3. Xóa chính nó
        await request(app).delete(`/todos/${newTodo.body.id}`);

        // 4. Số lượng phải bằng ban đầu
        const listAfter = await request(app).get('/todos');
        expect(listAfter.body.length).toBe(countBefore);
    });
});
