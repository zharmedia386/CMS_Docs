const { body } = require('express-validator');

const validateCreateUser = [
  body('title').isString().withMessage('title must be a string'),
  body('documentationId').isString().withMessage('documentationId must be a string'),
  body('version').isString().withMessage('version must be an array'),
];

module.exports = { validateCreateUser };