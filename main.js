
require('dotenv').config();


const express = require('express');
const eventsRoutes = require('./src/routes/eventsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const secureRoutes = require('./src/routes/secureRoutes');
const complexRoutes = require('./src/routes/complexRoutes');
const { authenticateToken } = require('./src/middleware/authMiddleware');
const { handleDatabaseError } = require('./src/middleware/errorMiddleware');

const app = express();

app.use(express.json());

app.use('/api', usersRoutes);
app.use('/api', authRoutes);
app.use('/api', authenticateToken, eventsRoutes);

app.use(handleDatabaseError);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`)
});
