const express = require('express');
const router = express.Router();
const versioningController = require('../../controllers/versioningController')

router.route('/')
    .get(versioningController.test)

router.route('/reorder')
    .put(versioningController.reorderDocumentationsContent)

router.route('/section')
    .put(versioningController.addSection)

router.route('/chapter')
    .put(versioningController.addChapter)

module.exports = router;