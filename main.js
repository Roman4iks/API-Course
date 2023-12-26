
require('dotenv').config();


const express = require('express');
const eventsRoutes = require('./src/routes/eventsRoutes');
const membersRoutes = require('./src/routes/membersRoutes');
const eventsParticipantsRoutes = require('./src/routes/eventsParticipants');
const partiesRoutes = require('./src/routes/partiesRoutes');
const positionsRoutes = require('./src/routes/positionsRoutes');
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

app.use('/api', eventsRoutes);
// app.use('/api', membersRoutes);
// app.use('/api', eventsParticipantsRoutes);
// app.use('/api', partiesRoutes);
// app.use('/api', positionsRoutes);
// app.use('/api', complexRoutes);

app.use(handleDatabaseError);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`)
});