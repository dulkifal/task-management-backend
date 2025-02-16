const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./utils/db');
const app = express();


app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded request bodies
// cors 
app.use(require('cors')());


// Connect to MongoDB
connectDB();
// Routes
app.use('/test', (req, res) => res.send('task-management'))
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks',errorHandler.checkBlacklist, require('./routes/task'));
app.use('/api/users', require('./routes/users'));

// Error handler
app.use(errorHandler.errorHandler);

app.listen(3000, () => console.log('Server running on port 3000'));