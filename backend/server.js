require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/videos', require('./routes/videos'));
app.use('/users', require('./routes/users'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'VeeraTube API' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 VeeraTube backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
