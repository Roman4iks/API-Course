const pool = require('../utils/pool');

async function getAllPositions(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Positions"');
    const positions = result.rows;
    client.release();

    res.json(positions);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getPositionById(req, res) {
  const positionId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Positions" WHERE position_id = $1', [positionId]);
    const position = result.rows[0];
    client.release();

    if (position) {
      res.json(position);
    } else {
      res.status(404).send('Position not found');
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

async function createPosition(req, res) {
  const { name, description } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO public."Positions" (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    const newPosition = result.rows[0];
    client.release();

    res.json(newPosition);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getAllPositions, getPositionById, createPosition };
