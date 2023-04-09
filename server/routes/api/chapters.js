const express = require('express');
const router = express.Router();
const chaptersController = require('../../controllers/chaptersController')
const { verifyJWT } = require("../../middleware/verifyJWT")

// Validations Middleware
const { validate } = require("../../middleware/validation")

// Validators Rules
const { createChapterRules, updateChapterRules } = require("../../validators/chaptersValidator")

router.route('/')
    .get(chaptersController.getAllChapters)
    .post(verifyJWT, createChapterRules, validate, chaptersController.createNewChapter)
    .put(verifyJWT, updateChapterRules, validate, chaptersController.updateChapter)
    .delete(verifyJWT, chaptersController.deleteChapter);

router.route('/:id')
    .get(getChapterByIdRules, validate, chaptersController.getChaptersById);

module.exports = router;