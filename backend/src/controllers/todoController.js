let todos = [];

exports.getTodos = (req, res) => {
    res.json(todos);
};

exports.createTodo = (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ msg: "Title required" });
    }

    const todo = {
        id: Date.now(),
        title: req.body.title
    };

    todos.push(todo);
    res.status(201).json(todo);
};

exports.deleteTodo = (req, res) => {
    todos = todos.filter(t => t.id != req.params.id);
    res.json({ msg: "Deleted" });
};