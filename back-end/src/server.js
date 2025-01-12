const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const matchRoutes = require('./routes/matchRoutes');
const standingRoutes = require('./routes/standingRoutes');
const scorerRoutes = require('./routes/scorerRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/get-matches', matchRoutes);
app.use('/standings', standingRoutes);
app.use('/top-scorers', scorerRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});