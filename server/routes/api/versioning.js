const express = require('express');
const router = express.Router();
const versioningController = require('../../controllers/versioningController')

router.route('/create')
    .put(versioningController.createVersion)

router.route('/reorder')
    .put(versioningController.reorderDocumentationsContent)

router.route('/section')
    .put(versioningController.addSection)

router.route('/section/delete')
    .put(versioningController.deleteSection)

router.route('/chapter')
    .put(versioningController.addChapter)

router.route('/chapter/delete')
    .put(versioningController.deleteChapter)

module.exports = router;