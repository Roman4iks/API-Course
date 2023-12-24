const bcrypt = require('bcrypt');
const pool = require('../utils/pool');

async function createUser(req, res) {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO public."Users" (email, password, username) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, username]
    );
    const newUser = result.rows[0];
    client.release();

    if(!newUser) {
      res.status(404).send('Event not found');
    }
    res.json(newUser);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { createUser };
