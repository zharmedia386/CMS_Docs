const express = require('express');
const router = express.Router();
const documentationsController = require('../../controllers/documentationsController')
const { verifyJWT } = require("../../middleware/verifyJWT")

router.route('/')
    .get(documentationsController.getAllDocumentationContent)
    .post(verifyJWT, documentationsController.createNewDocumentation)
    .put(verifyJWT, documentationsController.updateDocumentation)
    .delete(verifyJWT, documentationsController.deleteDocumentation);

router.route('/version')
    .get(documentationsController.getAllVersions);

router.route('/metadata')
    .get(documentationsController.getMetadata)
    .put(documentationsController.updateMetadata)

module.exports = router;