const validateIntegerParam = require("../utils/validateInteger");

function validateEventId(req, res, next) {
  const eventId = validateIntegerParam(req.params.id);

  if (eventId === null) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  req.params.id = eventId;
  next();
}

module.exports = validateEventId;
