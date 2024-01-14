const { validateRequiredFields } = require("../middleware/validationMiddleware");
const pool = require("../utils/pool");
const { handleDatabaseError } = require("../middleware/errorMiddleware");

const validatePositionFields = validateRequiredFields(["name", "discription"]);

async function getAllPositions(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM positions');
    const positions = result.rows;
    client.release();

    res.json(positions);
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

async function getPositionById(req, res) {
  const positionId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM positions WHERE position_id = $1',
      [positionId]
    );
    const position = result.rows[0];
    client.release();

    if (position) {
      res.json(position);
    } else {
      res.status(404).send("Position not found");
    }
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

async function createPosition(req, res) {
  validatePositionFields(req, res, async () => {
    const { name, discription } = req.body;

    try {
      const client = await pool.connect()
      const result = await client.query(
        'INSERT INTO positions (name, discription) VALUES ($1, $2) RETURNING *',
        [name, discription]
      );
      const newPosition = result.rows[0];
      client.release();

      if (!newPosition) {
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(newPosition);
    } catch (error) {
      handleDatabaseError(error, req, res);
    }
  });
}

async function updatePosition(req, res) {
  const positionId = req.params.id;
  validatePositionFields(req, res, async () => {
    const { name, discription } = req.body;

    if (!positionId) {
      return res.status(400).json({ error: "Position ID is required" });
    }

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE positions SET name = $1, discription = $2 WHERE position_id = $3 RETURNING *',
        [name, discription, positionId]
      );
      const updatedPosition = result.rows[0];
      client.release();

      res.json(updatedPosition);
    } catch (error) {
      handleDatabaseError(error, req, res);
    }
  });
}

async function deletePosition(req, res) {
  const positionId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM positions WHERE position_id = $1 RETURNING *',
      [positionId]
    );
    const deletedPosition = result.rows[0];
    client.release();

    if (deletedPosition) {
      res.json(deletedPosition);
    } else {
      res.status(404).send("Position not found");
    }
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
};