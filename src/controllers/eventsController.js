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
  "date_start",
  "date_end",
  "location",
]);
const validateDateFields = validateDateFormat(["date_start", "date_end"]);
const validateDateRangeFields = validateDateRange("date_start", "date_end");

async function getAllEvents(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public."Events"');
    const events = result.rows;
    client.release();

    res.json(events);
  } catch (error) {
  handleDatabaseError(error, req, resд)
  }
}

async function getEventById(req, res) {
  const eventId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM public."Events" WHERE event_id = $1',
      [eventId]
    );
    const event = result.rows[0];
    client.release();

    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
  handleDatabaseError(error, req, res)
  }
}

async function createEvent(req, res) {
  validateEventAndDateFields(req, res, async () => {
    const { name, date_start, date_end, location, description } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO public."Events" (name, date_start, date_end, location, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, date_start, date_end, location, description]
      );
      const newEvent = result.rows[0];
      client.release();

      if (!newEvent) {
        return res.status(401).json({ error: "Result failed" });
      }

      res.json(newEvent);
    } catch (error) {
    handleDatabaseError(error, req, res);
    }
  });
}

async function updateEvent(req, res) {
  const eventId = req.params.id;
  validateEventAndDateFields(req, res, async () => {
    const { name, date_start, date_end, location, description } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    try {
      const client = await pool.connect();
      const result = await client.query(
        'UPDATE public."Events" SET name = $1, date_start = $2, date_end = $3, location = $4, description = $5 WHERE event_id = $6 RETURNING *',
        [name, date_start, date_end, location, description, eventId]
      );
      const updatedEvent = result.rows[0];
      client.release();

      res.json(updatedEvent);
    } catch (error) {
    handleDatabaseError(error, req, res);
    }
  });
}

async function deleteEvent(req, res) {
  const eventId = req.params.id;

  try {
    const client = await pool.connect();
    const result = await client.query(
      'DELETE FROM public."Events" WHERE event_id = $1 RETURNING *',
      [eventId]
    );
    const deletedEvent = result.rows[0];
    client.release();

    if (deletedEvent) {
      res.json(deletedEvent);
    } else {
      res.status(404).send("Event not found");
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
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
