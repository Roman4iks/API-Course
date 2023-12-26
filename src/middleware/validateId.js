const validateIntegerParam = require("../utils/validateInteger");

function validateId(req, res, next) {
  const Id = validateIntegerParam(req.params.id);

  if (Id === null) {
    return res.status(400).json({ error: 'Invalid event ID' });
  }

  req.params.id = Id;
  next();
}

module.exports = validateId;
