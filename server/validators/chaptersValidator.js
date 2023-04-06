const { body } = require('express-validator');

const createChapterRules = [
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string'),
  body('documentationId')
    .notEmpty().withMessage('documentationId is required').bail()
    .isString().withMessage('documentationId must be a string'),
  body('version')
    .notEmpty().withMessage('version is required').bail()
    .isString().withMessage('version must be an array'),
];

const updateChapterRules = [
  body('id')
    .notEmpty().withMessage('id is required').bail()
    .isString().withMessage('id must be a string'),
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string'),
  body('documentationId')
    .notEmpty().withMessage('documentationId is required').bail()
    .isString().withMessage('documentationId must be a string'),
  body('version')
    .notEmpty().withMessage('version is required').bail()
    .isString().withMessage('version must be an array'),
];

module.exports = { createChapterRules, updateChapterRules };