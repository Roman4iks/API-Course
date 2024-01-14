const {
  validateRequiredFields,
} = require("../middleware/validationMiddleware");
const pool = require("../utils/pool");

const {
  validateDateFormat,
  validateDateRange,
} = require("../middleware/dateValidationMiddleware");
const { handleDatabaseError } = require("../middleware/errorMiddleware");

const validateEventFields = validateRequiredFields([
  "name",
  "founded"
]);
const validateDateFields = validateDateFormat(["founded"]);
const validateDateRangeFields = validateDateRange("founded", "date_now");


async function getAllParties (req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."parties"');
    const party = result.rows;
    client.release();

    res.json(party);
  } catch (error) {
    handleDatabaseError(error, req, res)
  }
}

async function getPartyById (req, res) {
  const partyId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM public."parties" WHERE party_id = $1',
      [partyId]
    );
    const party = result.rows[0];
    client.release();

    if (!party) {
        res.status(404).send("Party not found");
    }
    res.json(party);
  } catch (error) {
    handleDatabaseError(error, req, res)
  }
}

async function createParty(req, res) {
    req.body['date_now'] = new Date()
    validateEventAndDateFields(req, res, async () => {
    const { name, founded } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO public."parties" ( name, founded ) VALUES ($1, $2) RETURNING *',
        [name, founded] 
      );
      const newParty = result.rows[0];
      client.release();

      if (!newParty) {
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(newParty);
    } catch (error) {
        handleDatabaseError(error, req, res);
    }
  });
}

async function updateParty(req, res) {
    req.body['date_now'] = new Date()
  const partyId = req.params.id;
  validateEventAndDateFields(req, res, async () => {
    const {name, founded} = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE public."parties" SET name = $1, founded = $2 WHERE party_id = $3 RETURNING *',
        [name, founded, partyId]
      );
      const updatedParty = result.rows[0];
      client.release();

      if(!updatedParty){
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(updatedParty);
    } catch (error) {
        handleDatabaseError(error, req, res);
    }
  });
}

async function deleteParty(req, res) {
  const partyId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM public."parties" WHERE party_id = $1 RETURNING *',
      [partyId]
    );
    const deletedParty = result.rows[0];
    client.release();

    if (!deletedParty) {
        res.status(404).send("Party not found");
    } else {
        res.json(deletedParty);
    }
  } catch (error) {
    handleDatabaseError(error, req, res)
  }
}

function validateEventAndDateFields(req, res, callback) {
  validateEventFields(req, res, () => {
    validateDateFields(req, res, () => {
      validateDateRangeFields(req, res, callback);
    });
  });
}

module.exports = { getAllParties, getPartyById, createParty, updateParty, deleteParty };
