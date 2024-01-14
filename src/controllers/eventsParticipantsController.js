const { validateRequiredFields } = require("../middleware/validationMiddleware");
const pool = require("../utils/pool");
const { handleDatabaseError } = require("../middleware/errorMiddleware");
const { validateDateFormat, validateDateRange } = require("../middleware/dateValidationMiddleware");

const validateParticipantFields = validateRequiredFields([
  "event_id",
  "member_id",
  "date_start",
  "date_end",
  "budget",
]);
;
const validateDateFields = validateDateFormat(["date_start", "date_end"]);
const validateDateRangeFields = validateDateRange("date_start", "date_end");

async function getAllParticipants(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM eventsparticipant');
    const participants = result.rows;
    client.release();

    res.json(participants);
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

async function getParticipantById(req, res) {
  const participationId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM eventsparticipant WHERE participation_id = $1',
      [participationId]
    );
    const participant = result.rows[0];
    client.release();

    if (participant) {
      res.json(participant);
    } else {
      res.status(404).send("Participant not found");
    }
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

async function createParticipant(req, res) {
  validateParticipantFields(req, res, async () => {
    const { event_id, member_id, date_start, date_end, budget } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO eventsparticipant (event_id, member_id, date_start, date_end, budget) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [event_id, member_id, date_start, date_end, budget]
      );
      const newParticipant = result.rows[0];
      client.release();

      if (!newParticipant) {
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(newParticipant);
    } catch (error) {
      handleDatabaseError(error, req, res);
    }
  });
}

async function updateParticipant(req, res) {
  const participationId = req.params.id;

  validateEventAndDateFields(req, res, async () => {
    const { event_id, member_id, date_start, date_end, budget } = req.body;

    if (!participationId) {
      return res.status(400).json({ error: "Participation ID is required" });
    }

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE eventsparticipant SET event_id = $1, member_id = $2, date_start = $3, date_end = $4, budget = $5 WHERE participation_id = $6 RETURNING *',
        [event_id, member_id, date_start, date_end, budget, participationId]
      );
      const updatedParticipant = result.rows[0];
      client.release();

      res.json(updatedParticipant);
    } catch (error) {
      handleDatabaseError(error, req, res);
    }
  });
}

async function deleteParticipant(req, res) {
  const participationId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM eventsparticipant WHERE participation_id = $1 RETURNING *',
      [participationId]
    );
    const deletedParticipant = result.rows[0];
    client.release();

    if (deletedParticipant) {
      res.json(deletedParticipant);
    } else {
      res.status(404).send("Participant not found");
    }
  } catch (error) {
    handleDatabaseError(error, req, res);
  }
}

function validateEventAndDateFields(req, res, callback) {
  validateParticipantFields(req, res, () => {
    validateDateFields(req, res, () => {
      validateDateRangeFields(req, res, callback);
    });
  });
}

module.exports = {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant,
};
