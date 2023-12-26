function validateIntegerParam(param) {
  const intValue = parseInt(param, 10);
  return !isNaN(intValue) ? intValue : null;
}

module.exports = validateIntegerParam