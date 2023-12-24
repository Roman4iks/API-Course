function validateDateFormat(fields) {
  return (req, res, next) => {
    const invalidFields = [];

    fields.forEach((field) => {
      const dateValue = req.body[field];
      if (dateValue && !isValidDate(dateValue)) {
        invalidFields.push(field);
      }
    });

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid date in field(s): ${invalidFields.join(', ')}` });
    }

    next();
  };
}

function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);

  // Проверка существования месяца (1-12) и дня (1-31)
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(year, month, 0).getDate();
}

function validateDateRange(startField, endField) {
  return (req, res, next) => {
    const startDate = req.body[startField];
    const endDate = req.body[endField];
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ error: 'Start date must be before end date' });
    }

    next();
  };
}

module.exports = { validateDateFormat, validateDateRange };
