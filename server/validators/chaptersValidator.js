const { body } = require('express-validator');

const createUserRules = [
  body('title').notEmpty().withMessage('title is required').isString().withMessage('title must be a string'),
  body('documentationId').notEmpty().withMessage('documentationId is required').isString().withMessage('documentationId must be a string'),
  body('version').notEmpty().withMessage('version is required').isString().withMessage('version must be an array'),
];

module.exports = { createUserRules };