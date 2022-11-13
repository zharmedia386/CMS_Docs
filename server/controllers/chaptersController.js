const chapterDB = require('../model/chapters')
const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all sections info
const getAllChapters = async (req, res) => {
    const Chapters = await chapterDB()
    if (!Chapters) return res.status(204).json({ 'message': 'No chapter found.' });

    res.status(200).send(await Chapters.find({}).toArray())
}

// Get specified sections info
const getChaptersById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Chapters ID required.' });

    const Chapters = await chapterDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Chapters) {
        return res.status(204).json({ "message": `No chapters matches ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Chapters.find({_id : objectId}).toArray())
}

// Create documentation info
const createNewChapter = async (req, res) => {
    // check all field required
    if (!req?.body?.title || !req?.body?.documentation || !req?.body?.version) {
        return res.status(400).json({ 'message': 'Title, documentation, and version is required' });
    }

    const Chapters = await chapterDB()
    const Documentation = await documentationDB();

    // convert chapter id from string into object id
    req.body.chapter._id = new mongo.ObjectId(req.body.chapter._id)

    try {
        // insert new chapters
        const insertedChapter = await Chapters.insertOne({
            title: req.body.title,
            documentation: req.body.documentation,
            version: req.body.version,
            createdAt: new Date(),
            updatedAt: new Date() 
        })

        // insert new chapters into documentations contents
        const result = await Documentation.updateOne(
            { content: { $elemMatch: { "version": `${req.body.version[0]}` } } },
            { $push: { "content.$.chapter": { "_id": insertedChapter.insertedId, "title": `${req.body.title}` } } }
        )

        // Check if chapters failed inserted into documentations content
        if ( result.modifiedCount == 0 ) {
            // Cancel inserting new sections
            await Chapters.deleteOne({ _id: insertedChapter.insertedId });
            throw new Error ("Error when try to insert chapter into documentations")
        }

        res.status(201).send({ message : "Chapters Data Created!" })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

module.exports = {
    getAllChapters,
    getChaptersById,
    createNewChapter
}