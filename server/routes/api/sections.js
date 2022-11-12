const express = require('express');
const router = express.Router();
const sectionsController = require('../../controllers/sectionsController')

router.route('/')
    .get(sectionsController.getAllSections)
    .post(sectionsController.createNewSection)
//     .put(documentationsController.updateDocumentation)
//     .delete(documentationsController.deleteDocumentation);

router.route('/:id')
    .get(sectionsController.getSectionsById);

module.exports = router;