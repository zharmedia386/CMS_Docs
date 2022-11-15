const express = require('express');
const router = express.Router();
const documentationsController = require('../../controllers/documentationsController')

router.route('/')
    .get(documentationsController.getAllDocumentations)
    .post(documentationsController.createNewDocumentation)
    .put(documentationsController.updateDocumentation)
    .delete(documentationsController.deleteDocumentation);

router.route('/:id')
    .get(documentationsController.getDocumentationById);

module.exports = router;