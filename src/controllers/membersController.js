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
    const result = await client.query('SELECT * FROM public."members"');
    const members = result.rows;
    client.release();

    res.json(members);
  } catch (error) {
  handleDatabaseError(error, req, res)
  }
}

async function getMemberById (req, res) {
  const memberId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM public."members" WHERE members_id = $1',
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
        'INSERT INTO public."members" (party_id, first_name, second_name, surname, date_of_birth, address, email, phone, position_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
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

async function updateMember(req, res) {
    req.body['date_now'] = new Date()
  const memberId = req.params.id;
  validateEventAndDateFields(req, res, async () => {
    const { party_id, first_name, second_name, surname, date_of_birth, address, email, phone, position_id } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE public."members" SET first_name = $1, second_name = $2, surname = $3, date_of_birth = $4, address = $5, email = $6, phone = $7, position_id = $8, party_id = $9 WHERE members_id = $10 RETURNING *',
        [first_name, second_name, surname, date_of_birth, address, email, phone, position_id, party_id, memberId]
      );
      const updatedMember = result.rows[0];
      client.release();

      if(!updatedMember){
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(updatedMember);
    } catch (error) {
        handleDatabaseError(error, req, res);
    }
  });
}

async function deleteMember(req, res) {
  const memberId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM public."members" WHERE members_id = $1 RETURNING *',
      [memberId]
    );
    const deletedMember = result.rows[0];
    client.release();

    if (!deletedMember) {
        res.status(404).send("Member not found");
    } else {
        res.json(deletedMember);
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

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    deleteMember,
    updateMember
}