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
