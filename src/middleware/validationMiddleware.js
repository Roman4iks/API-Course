// src/validationMiddleware.js
function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missingFields = [];
    // Проверка наличия обязательных полей
    requiredFields.forEach((field) => {
      if (!(field in req.body)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required field(s): ${missingFields.join(', ')}` });
    }

    next();
  };
}

module.exports = { validateRequiredFields };
