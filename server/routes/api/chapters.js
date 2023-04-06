const express = require('express');
const router = express.Router();
const chaptersController = require('../../controllers/chaptersController')
const { verifyJWT } = require("../../middleware/verifyJWT")
const { validateCreateUser } = require("../../validators/chaptersValidator")

router.route('/')
    .get(chaptersController.getAllChapters)
    .post(verifyJWT, validateCreateUser, chaptersController.createNewChapter)
    .put(verifyJWT, chaptersController.updateChapter)
    .delete(verifyJWT, chaptersController.deleteChapter);

router.route('/:id')
    .get(chaptersController.getChaptersById);

module.exports = router;