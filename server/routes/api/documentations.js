const express = require('express');
const router = express.Router();
const documentationsController = require('../../controllers/documentationsController')
const { verifyJWT } = require("../../middleware/verifyJWT")

/**
 * @swagger
 * tags:
 *   name: Documentations
 *   description: Documentation API
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *   schemas:
 *     Documentation: 
 *       type: object
 *       required:
 *         - title
 *         - logo
 *         - description
 *         - logoLink
 *         - footer
 *         - content
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         title:
 *           type: string
 *           description: The auto-generated id of the book
 *         logo:
 *           type: string
 *           description: The book title
 *         description:
 *           type: string
 *           description: The book author
 *         logoLink:
 *           type: object
 *           description: The book author
 *         footer:
 *           type: string
 *           description: The book author
 *         content:
 *           type: object
 *           description: The book author
 *         createdAt:
 *           type: object
 *           description: The book author
 *         updatedAt:
 *           type: object
 *           description: The book author
 * security:
 *   - bearerAuth: []
 * /documentations:
 *  get:
 *    description: Use to request all Documentations
 *    tags: [Documentations]
 *    responses:
 *      '200':
 *        description: A successful response
 *  post:
 *    security:
 *      - bearerAuth: []
 *    description: Use to request all Documentations
 *    tags: [Documentations]
 *    requestBody:
 *         description: Optional description in *Markdown*
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documentation'
 *    responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Documentation'
 *       500:
 *         description: Some server error
 */

router.route('/')
    .get(documentationsController.getAllDocumentationContent)
    .post(verifyJWT, documentationsController.createNewDocumentation)
    .put(verifyJWT, documentationsController.updateDocumentation)
    .delete(verifyJWT, documentationsController.deleteDocumentation);

router.route('/version')
    .get(documentationsController.getAllVersions);

router.route('/metadata')
    .get(documentationsController.getMetadata)
    .put(verifyJWT, documentationsController.updateMetadata)

router.route('/:version')
    .get(documentationsController.getDocumentations)

module.exports = router;