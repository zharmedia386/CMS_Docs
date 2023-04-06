const express = require('express');
const router = express.Router();
const chaptersController = require('../../controllers/chaptersController')
const { verifyJWT } = require("../../middleware/verifyJWT")

// Validators Rules
const { createUserRules } = require("../../validators/chaptersValidator")
const { validate } = require("../../validators/rootValidator")

router.route('/')
    .get(chaptersController.getAllChapters)
    .post(verifyJWT, createUserRules, validate, chaptersController.createNewChapter)
    .put(verifyJWT, chaptersController.updateChapter)
    .delete(verifyJWT, chaptersController.deleteChapter);

router.route('/:id')
    .get(chaptersController.getChaptersById);

module.exports = router;