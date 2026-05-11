const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================
// Enable CORS for all routes (allow frontend to access API)
app.use(cors({ origin: '*' }));

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware (optional)
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== ROUTES ====================
// Mount todo routes at /todos endpoint
app.use('/todos', require('./routes/todoRoutes'));

// ==================== HEALTH CHECK ====================
// Health endpoint for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ==================== ERROR HANDLING ====================
// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// ==================== SERVER START ====================
// Only start server if file is run directly (not imported for testing)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`✅ Server running on http://localhost:${PORT}`);
        // eslint-disable-next-line no-console
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        // eslint-disable-next-line no-console
        console.log(`📋 API endpoint: http://localhost:${PORT}/todos`);
    });
}

// Export app for testing with supertest
module.exports = app;