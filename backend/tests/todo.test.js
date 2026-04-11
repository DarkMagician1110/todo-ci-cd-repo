const request = require('supertest');
const app = require('../src/app');
const todoController = require('../src/controllers/todoController');

describe('Unit Test: Todo Controller Logic', () => {
    let req, res;

    // Reset lại req/res giả lập trước mỗi bài test
    beforeEach(() => {
        req = {
            body: {},
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    // Test Case 1: Validation lỗi rỗng
    test('Unit: createTodo phải trả về 400 nếu title rỗng', async () => {
        req.body.title = "";
        await todoController.createTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }));
    });

    // Test Case 2: Validation lỗi chỉ toàn khoảng trắng
    test('Unit: createTodo phải trả về 400 nếu title chỉ có khoảng trắng', async () => {
        req.body.title = "     ";
        await todoController.createTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    // Test Case 3: Lưu dữ liệu thành công
    test('Unit: createTodo phải trả về 201 và object todo khi dữ liệu đúng', async () => {
        const myTask = "Học lập trình";
        req.body.title = myTask;
        await todoController.createTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            title: myTask
        }));
    });

    // Test Case 4: Lấy danh sách
    test('Unit: getAllTodos phải trả về 200 và một danh sách', async () => {
        await todoController.getAllTodos(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    // Test Case 5: Xóa ID không tồn tại
    test('Unit: deleteTodo phải trả về 404 khi ID không có trong hệ thống', async () => {
        req.params.id = "id-khong-ton-tai";
        await todoController.deleteTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    // Test Case 6: Độ dài dữ liệu (Edge Case)
    test('Unit: createTodo nên xử lý được title cực dài', async () => {
        req.body.title = "a".repeat(1000);
        await todoController.createTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Unit: createTodo nên xử lý các ký tự đặc biệt (chống XSS)', async () => {
        req.body.title = "<script>alert('hack')</script>";
        await todoController.createTodo(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('Unit: createTodo nên cắt khoảng trắng thừa ở hai đầu title', async () => {
        req.body.title = "   Học CI/CD   ";
        await todoController.createTodo(req, res);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            title: "Học CI/CD"
        }));
    });

    test('Unit: getAllTodos phải phản hồi trong thời gian dưới 5ms', async () => {
        const start = performance.now();
        await todoController.getAllTodos(req, res);
        const end = performance.now();
        expect(end - start).toBeLessThan(5);
    });
});



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

    // Test POST: Lỗi validation (Dành điểm cao môn Mô hình hóa)
    it('POST /todos - Phải báo lỗi 400 nếu gửi title rỗng', async () => {
        const res = await request(app)
            .post('/todos')
            .send({ title: "" });

        expect(res.statusCode).toBe(400);
    });

    // Test DELETE: Xóa công việc (Tính năng chính trong README)
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