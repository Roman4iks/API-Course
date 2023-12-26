
require('dotenv').config();


const express = require('express');
const authRoutes = require('./src/routes/authRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const eventsRoutes = require('./src/routes/eventsRoutes');
const memmberRoutes = require('./src/routes/membersRoutes');
const partiesRoutes = require('./src/routes/partiesRoutes');
const { handleDatabaseError } = require('./src/middleware/errorMiddleware');

const app = express();

app.use(express.json());

app.use('/api', usersRoutes);
app.use('/api', authRoutes);

app.use('/api', eventsRoutes);
app.use('/api', memmberRoutes);
app.use('/api', partiesRoutes);
// app.use('/api', eventsParticipantsRoutes);
// app.use('/api', positionsRoutes);
// app.use('/api', complexRoutes);

app.use(handleDatabaseError);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`)
});
