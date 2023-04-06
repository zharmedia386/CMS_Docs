const { body, validationResult } = require('express-validator');

const validateCreateUser = [
  body('title').isString().withMessage('title must be a string'),
  body('documentationId').isString().withMessage('documentationId must be a string'),
  body('version').isString().withMessage('version must be an array'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  };

module.exports = { validateCreateUser, validate };