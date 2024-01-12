const pool = require('../utils/pool');

async function getAllParticipants(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."EventsParticipants"');
    const participants = result.rows;
    client.release();

    res.json(participants);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getParticipantById(req, res) {
  const participantId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."EventsParticipants" WHERE participation_id = $1', [participantId]);
    const participant = result.rows[0];
    client.release();

    if (participant) {
      res.json(participant);
    } else {
      res.status(404).send('Participant not found');
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

async function createParticipant(req, res) {
  const { event_id, member_id, date_start, date_end, budget } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO public."EventsParticipants" (event_id, member_id, date_start, date_end, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_id, member_id, date_start, date_end, budget]
    );
    const newParticipant = result.rows[0];
    client.release();

    res.json(newParticipant);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getAllParticipants, getParticipantById, createParticipant };
