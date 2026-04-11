let todos = [];


//exports.getAllTodos = (req, res) => {
//    res.json(todos);
//};
 exports.getAllTodos = (req, res) => {
     res.status(200).json(todos);
 };

exports.createTodo = (req, res) => {
    let title = req.body.title;

    // Xử lý Trim (Cắt khoảng trắng thừa)
    if (title) title = title.trim();

    // Kiểm tra title rỗng hoặc chỉ toàn khoảng trắng
    if (!title || title === "") {
        return res.status(400).json({ message: "Title required" });
    }

    const todo = {
        id: Date.now(),
        title: title
    };

    todos.push(todo);
    res.status(201).json(todo);
};

exports.deleteTodo = (req, res) => {
    const { id } = req.params;

    // Tìm vị trí của phần tử (để biết nó có tồn tại hay không)
    const index = todos.findIndex(t => t.id == id);
    if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    // Nếu tìm thấy thì mới xóa
    todos.splice(index, 1);
    res.json({ message: "Deleted" });
};