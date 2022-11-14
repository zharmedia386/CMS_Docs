const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all documentation info
const getAllDocumentations = async (req, res) => {
    const Documentations = await documentationDB()
    if (!Documentations) return res.status(204).json({ 'message': 'No documentation found.' });

    res.status(200).send(await Documentations.find({}).toArray())
}

// Get specified documentation info
const getDocumentationById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Documentation ID required.' });

    const Documentations = await documentationDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Documentations) {
        return res.status(204).json({ "message": `No documentations matches ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Documentations.find({_id : objectId}).toArray())
}

// Create documentation info
const createNewDocumentation = async (req, res) => {
    if (!req?.body?.title || !req?.body?.description) {
        return res.status(400).json({ 'message': 'Title and Descriptions are required' });
    }

    const Documentations = await documentationDB()
    await Documentations.insertOne({
        title : req.body.title,
        logo : req.body.logo,
        description : req.body.description,
        logoLink : req.body.logoLink,
        footer : req.body.footer,
        content : req.body.content,
        createdAt : req.body.createdAt,
        updatedAt : req.body.updatedAt,
    })

    res.status(201).send({
        message : "Documentation Data Created!" 
    })
}

// Edit documentation info
const updateDocumentation = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Documentation ID required.' });

    const Documentations = await documentationDB()
    let objectId = new mongo.ObjectId(req.params.id)
    await Documentations.updateOne({
        _id : objectId
    }, {
        $set : {
            title : req.body.title,
            // logo : req.body.logo,
            // description : req.body.description,
            // logoLink : req.body.logoLink,
            // footer : req.body.footer,
            // content : req.body.content,
            // createdAt : req.body.createdAt,
            // updatedAt : req.body.updatedAt,
        }
    })
    res.status(204).send({
        message : "Documentation Data Updated!"
    })
}

// Delete documentation info
const deleteDocumentation = async (req, res) => {
    const Documentations = await documentationDB()
    let objectId = new mongo.ObjectId(req.params.id)
    await Documentations.deleteMany({
        _id: objectId
    })
    res.status(200).send({
        message : "Documentation Data Deleted!"
    })
}

module.exports = {
    getAllDocumentations,
    createNewDocumentation,
    updateDocumentation,
    deleteDocumentation,
    getDocumentationById
}