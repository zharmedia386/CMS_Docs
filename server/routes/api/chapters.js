const express = require('express');
const router = express.Router();
const chaptersController = require('../../controllers/chaptersController')

router.route('/')
    .get(chaptersController.getAllChapters)
    .post(chaptersController.createNewChapter)
//     .put(documentationsController.updateDocumentation)
//     .delete(documentationsController.deleteDocumentation);

router.route('/:id')
    .get(chaptersController.getChaptersById);

module.exports = router;