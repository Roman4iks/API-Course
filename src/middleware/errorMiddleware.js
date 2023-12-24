// src/errorHandler.js
function handleDatabaseError(error, req, res, next) {
  console.error('Database Error:', error);

  let statusCode = 500;
  let errorMessage = 'Internal Server Error';

  // Проверка типа ошибки базы данных
  switch (error.code) {
    case '23505':
      // Уникальное ограничение нарушено (дублирующийся ключ)
      statusCode = 400;
      errorMessage = 'Duplicate key violation';
      break;

    case '23503':
      // Ошибка внешнего ключа
      statusCode = 400;
      errorMessage = 'Foreign key constraint violation';
      break;

    case '23502':
      // Отсутствие значения в столбце с ограничением NOT NULL
      statusCode = 400;
      errorMessage = 'Column with NOT NULL constraint cannot be null';
      break;

    case '22P02':
      // Ошибка типа данных
      statusCode = 400;
      errorMessage = 'Invalid data type';
      break;

    case '22012':
      // Ошибка деления на ноль
      statusCode = 400;
      errorMessage = 'Division by zero';
      break;

    case '23514':
      // Ошибка ограничения CHECK
      statusCode = 400;
      errorMessage = 'CHECK constraint violation';
      break;

    // Дополнительные проверки типов ошибок могут быть добавлены по необходимости

    default:
      // Общая ошибка базы данных
      statusCode = 500;
      errorMessage = 'Internal Server Error';
  }

  res.status(statusCode).json({ error: errorMessage });
}

module.exports = { handleDatabaseError };
