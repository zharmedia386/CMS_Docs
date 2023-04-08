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
    .isArray().withMessage('version must be an array').bail(),
];

const updateChapterRules = [
  body('id')
    .notEmpty().withMessage('id is required').bail()
    .isString().withMessage('id must be a string').bail()
    .isLength({ min: 24, max: 24 }).withMessage("id must have length of 24 characters"),
  body('title')
    .notEmpty().withMessage('title is required').bail()
    .isString().withMessage('title must be a string'),
  body('documentationId')
    .notEmpty().withMessage('documentationId is required').bail()
    .isString().withMessage('documentationId must be a string'),
  body('version')
    .notEmpty().withMessage('version is required').bail()
    .isArray().withMessage('version must be an array'),
];

module.exports = { createChapterRules, updateChapterRules };