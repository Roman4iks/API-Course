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
  "first_name",
  "second_name",
  "surname",
  "date_of_birth",
  "address",
  "email",
  "phone"
]);
const validateDateFields = validateDateFormat(["date_of_birth"]);
const validateDateRangeFields = validateDateRange("date_of_birth", "date_now");



async function getAllMembers  (req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Members"');
    const members = result.rows;
    client.release();

    res.json(members);
  } catch (error) {
  handleDatabaseError(error, req, res)
  }
}

async function getMember (req, res) {
  const memberId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM public."Members" WHERE members_id = $1',
      [memberId]
    );
    const member = result.rows[0];
    client.release();

    if (!member) {
        res.status(404).send("Member not found");
    }
    res.json(member);
  } catch (error) {
    handleDatabaseError(error, req, res)
  }
}

async function createMember(req, res) {
    req.body['date_now'] = new Date()
    validateEventAndDateFields(req, res, async () => {
    const { party_id, first_name, second_name, surname, date_of_birth, address, email, phone, position_id } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO public."Members" (party_id, first_name, second_name, surname, date_of_birth, address, email, phone, position_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [party_id, first_name, second_name, surname, date_of_birth, address, email, phone, position_id] 
      );
      const newMember = result.rows[0];
      client.release();

      if (!newMember) {
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(newMember);
    } catch (error) {
        handleDatabaseError(error, req, res);
    }
  });
}

function validateEventAndDateFields(req, res, callback) {
  validateEventFields(req, res, () => {
    validateDateFields(req, res, () => {
      validateDateRangeFields(req, res, callback);
    });
  });
}

module.exports = {
    getMember,
    getAllMembers,
    createMember
}