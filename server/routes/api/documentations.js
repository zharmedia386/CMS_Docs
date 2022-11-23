const express = require('express');
const router = express.Router();
const documentationsController = require('../../controllers/documentationsController')

router.route('/')
    .post(documentationsController.createNewDocumentation)
    .put(documentationsController.updateDocumentation)
    .delete(documentationsController.deleteDocumentation);

router.route('/version')
    .get(documentationsController.getAllVersions);

router.route('/metadata')
    .get(documentationsController.getMetadata);

router.route('/:version')
    .get(documentationsController.getDocumentations)

module.exports = router;