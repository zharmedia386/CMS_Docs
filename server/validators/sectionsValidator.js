const { body, param } = require('express-validator');

const getSectionByIdRules = [
    param('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .isLength({ min: 24, max: 24 }).withMessage("id must have length of 24 characters")
];

const createSectionRules = [
    body('title')
        .notEmpty().withMessage("title is required").bail()
        .isString().withMessage("id must be a string"),
    body('content')
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string"),
    body('alias')
        .optional()
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string")
];

const updateSectionRules = [
    body('id')
        .notEmpty().withMessage("id is required").bail()
        .isString().withMessage("id must be a string").bail()
        .isLength({ min: 24, max: 24 }).withMessage("id must have length of 24 characters"),
    body('title')
        .notEmpty().withMessage("title is required").bail()
        .isString().withMessage("id must be a string"),
    body('content')
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string"),
    body('alias')
        .optional()
        .notEmpty().withMessage("content is required").bail()
        .isString().withMessage("content must be a string")
];

module.exports = {
    getSectionByIdRules,
    createSectionRules,
    updateSectionRules
};