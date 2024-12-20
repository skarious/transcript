const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const dotenv = require('dotenv');
const transcriptionRoutes = require('./routes/transcription');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    logger.info(`📨 ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/transcription', transcriptionRoutes);

// Error handling
app.use((err, req, res, next) => {
    logger.error(`❌ Error: ${err.message}`);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});
