const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../utils/pool');

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Users" WHERE email = $1', [email]);
    const user = result.rows[0];
    client.release();

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({ token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { login };
