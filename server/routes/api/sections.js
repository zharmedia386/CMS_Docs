const express = require('express');
const router = express.Router();
const sectionsController = require('../../controllers/sectionsController')

router.route('/')
    .get(sectionsController.getAllSections)
    .post(sectionsController.createNewSection)
    .put(sectionsController.updateSection)
    .delete(sectionsController.deleteSection);

router.route('/version')
    .put(sectionsController.addVersionSection)

router.route('/:id')
    .get(sectionsController.getSectionsById)

module.exports = router;