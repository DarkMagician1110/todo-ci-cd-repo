const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// routes
app.use('/todos', require('./routes/todoRoutes'));

module.exports = app;

// run server
if (require.main === module) {
    app.listen(3000, () => console.log("Server running on port 3000"));
}