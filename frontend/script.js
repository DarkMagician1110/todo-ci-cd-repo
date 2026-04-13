// ==================== CONFIGURATION ====================
const API_URL = 'http://localhost:3000';
const TODOS_ENDPOINT = `${API_URL}/todos`;
const HEALTH_ENDPOINT = `${API_URL}/health`;

// ==================== DOM ELEMENTS ====================
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearBtn = document.getElementById('clearBtn');
const apiStatusDiv = document.getElementById('apiStatus');
const statusText = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');
const aboutModal = document.getElementById('aboutModal');

// ==================== EVENT LISTENERS ====================
// Add todo on button click
addBtn.addEventListener('click', addTodo);

// Add todo on Enter key press
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Clear all todos
clearBtn.addEventListener('click', clearAllTodos);

// ==================== MAIN FUNCTIONS ====================

/**
 * Load all todos from API
 */
async function loadTodos() {
    try {
        const response = await fetch(TODOS_ENDPOINT);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const todos = await response.json();

        // Update UI
        renderTodos(todos);
        updateTodoCount(todos.length);
        updateApiStatus(true, 'Connected');

    } catch (error) {
        console.error('Error loading todos:', error);
        showError('Failed to load todos. Is the server running?');
        updateApiStatus(false, 'Disconnected');
    }
}

/**
 * Render todos to the DOM
 * @param {Array} todos - Array of todo objects
 */
function renderTodos(todos) {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-state';
        emptyItem.textContent = '🎉 No todos yet! Add one to get started.';
        todoList.appendChild(emptyItem);
        return;
    }

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <span class="todo-text">${escapeHTML(todo.title)}</span>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})" title="Delete todo">❌</button>
        `;
        todoList.appendChild(li);
    });
}

/**
 * Add new todo
 */
async function addTodo() {
    const title = todoInput.value.trim();

    // Validation
    if (!title) {
        showError('Please enter a todo');
        return;
    }

    if (title.length > 1000) {
        showError('Todo is too long (max 1000 characters)');
        return;
    }

    try {
        const response = await fetch(TODOS_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: title })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add todo');
        }

        // Clear input
        todoInput.value = '';
        todoInput.focus();

        // Reload todos
        await loadTodos();

        // Show success message
        showSuccess('Todo added successfully! ✓');

    } catch (error) {
        console.error('Error adding todo:', error);
        showError(error.message || 'Failed to add todo');
    }
}

/**
 * Delete todo by ID
 * @param {number} id - Todo ID
 */
async function deleteTodo(id) {
    // Confirmation
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    try {
        const response = await fetch(`${TODOS_ENDPOINT}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Reload todos
        await loadTodos();

        // Show success message
        showSuccess('Todo deleted successfully! ✓');

    } catch (error) {
        console.error('Error deleting todo:', error);
        showError('Failed to delete todo');
    }
}

/**
 * Clear all todos
 */
async function clearAllTodos() {
    const todoItems = document.querySelectorAll('.todo-item');
    
    if (todoItems.length === 0) {
        showError('No todos to clear');
        return;
    }

    if (!confirm(`Delete all ${todoItems.length} todos?`)) {
        return;
    }

    try {
        // Delete each todo
        for (const item of todoItems) {
            const deleteBtn = item.querySelector('.btn-delete');
            deleteBtn.click();
        }

        showSuccess('All todos cleared! ✓');

    } catch (error) {
        console.error('Error clearing todos:', error);
        showError('Failed to clear todos');
    }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Update todo count display
 * @param {number} count - Number of todos
 */
function updateTodoCount(count) {
    todoCount.textContent = `📊 Total: ${count}`;
}

/**
 * Update API status indicator
 * @param {boolean} isConnected - Connection status
 * @param {string} message - Status message
 */
function updateApiStatus(isConnected, message) {
    if (isConnected) {
        statusDot.style.backgroundColor = '#4caf50';
        statusText.textContent = `✅ ${message}`;
        statusText.style.color = '#4caf50';
    } else {
        statusDot.style.backgroundColor = '#f44336';
        statusText.textContent = `❌ ${message}`;
        statusText.style.color = '#f44336';
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    console.error('ERROR:', message);
    alert(`❌ ${message}`);
}

/**
 * Show success message
 * @param {string} message - Success message
 */
function showSuccess(message) {
    console.log('SUCCESS:', message);
    // Optional: Show toast/notification
    // In a real app, you might use a toast library
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHTML(text) {
    if (typeof text !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Open API documentation
 */
function openAPI() {
    alert(`
API Endpoints:

GET ${API_URL}/todos
  → Get all todos

POST ${API_URL}/todos
  → Create new todo
  → Body: {"title": "Your todo text"}

DELETE ${API_URL}/todos/:id
  → Delete todo by ID

GET ${API_URL}/health
  → Check server health
    `);
}

/**
 * Show about modal
 */
function showAbout() {
    aboutModal.classList.remove('hidden');
}

/**
 * Close about modal
 */
function closeAbout() {
    aboutModal.classList.add('hidden');
}

// ==================== INITIALIZATION ====================

/**
 * Check server health
 */
async function checkServerHealth() {
    try {
        const response = await fetch(HEALTH_ENDPOINT);
        if (response.ok) {
            updateApiStatus(true, 'Connected');
            return true;
        }
    } catch (error) {
        updateApiStatus(false, 'Server not responding');
        return false;
    }
}

/**
 * Initialize app
 */
async function initialize() {
    console.log('🚀 Initializing Todo App...');

    // Check server health
    const isHealthy = await checkServerHealth();

    if (isHealthy) {
        // Load todos
        await loadTodos();
        console.log('✅ App initialized successfully');
    } else {
        console.error('❌ Failed to connect to server');
        showError('Cannot connect to server. Make sure the backend is running on http://localhost:3000');
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
