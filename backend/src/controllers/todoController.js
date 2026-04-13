// In-memory storage for todos (in production, use database)
let todos = [];

/**
 * Get all todos
 * GET /todos
 * @returns {Array} Array of all todos
 */
exports.getAllTodos = (req, res) => {
    try {
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching todos', error: err.message });
    }
};

/**
 * Create new todo
 * POST /todos
 * @param {string} req.body.title - Todo title (required)
 * @returns {Object} Created todo object with id and title
 */
exports.createTodo = (req, res) => {
    try {
        let { title } = req.body;

        // ==================== VALIDATION ====================
        // Trim whitespace from input
        if (title && typeof title === 'string'){
            title = title.trim();
        }

        // Check if title is empty or missing
        if (!title || title === '') {
            return res.status(400).json({
                message: 'Title is required and cannot be empty'
            });
        }

        // ==================== CREATE TODO ====================
        // Generate unique ID using timestamp
        const newTodo = {
            id: Date.now(),
            title: title,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        // Add to storage
        todos.push(newTodo);

        // Return created todo with 201 status code
        res.status(201).json(newTodo);

    } catch (err) {
        res.status(500).json({
            message: 'Error creating todo',
            error: err.message
        });
    }
};

/**
 * Delete todo by ID
 * DELETE /todos/:id
 * @param {number} req.params.id - Todo ID
 * @returns {Object} Success message or error
 */
exports.deleteTodo = (req, res) => {
    try {
        const { id } = req.params;

        // ==================== VALIDATION ====================
        // Find index of todo with matching ID
        const index = todos.findIndex(t => {
            // Support both number and string ID comparison
            return String(t.id) === String(id) || t.id === parseInt(id);
        });

        // Check if todo exists
        if (index === -1) {
            return res.status(404).json({
                message: 'Todo not found',
                id: id
            });
        }

        // ==================== DELETE TODO ====================
        // Remove from storage
        const deletedTodo = todos.splice(index, 1);

        // Return success response
        res.status(200).json({
            message: 'Todo deleted successfully',
            deleted: deletedTodo[0]
        });

    } catch (err) {
        res.status(500).json({
            message: 'Error deleting todo',
            error: err.message
        });
    }
};

/**
 * Update todo status (optional - for future enhancement)
 * PATCH /todos/:id
 * @param {number} req.params.id - Todo ID
 * @param {string} req.body.status - New status
 * @returns {Object} Updated todo or error
 */
exports.updateTodo = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find todo
        const todo = todos.find(t => String(t.id) === String(id));

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Update status
        if (status) {
            todo.status = status;
        }

        res.status(200).json(todo);

    } catch (err) {
        res.status(500).json({
            message: 'Error updating todo',
            error: err.message
        });
    }
};