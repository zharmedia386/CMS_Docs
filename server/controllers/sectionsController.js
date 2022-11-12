const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all sections info
const getAllSections = async (req, res) => {
    const Sections = await sectionsDB()
    if (!Sections) return res.status(204).json({ 'message': 'No section found.' });

    res.status(200).send(await Sections.find({}).toArray())
}

// Get specified sections info
const getSectionsById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Sections ID required.' });

    const Sections = await sectionsDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Sections) {
        return res.status(204).json({ "message": `No sections matches ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Sections.find({_id : objectId}).toArray())
}

// Create documentation info
const createNewSection = async (req, res) => {
    // check all field required
    if (!req?.body?.title || !req?.body?.content || !req?.body?.version || !req?.body?.chapter) {
        return res.status(400).json({ 'message': 'Title, content, version, and chapter is required' });
    }

    const Sections = await sectionsDB()
    const Documentation = await documentationDB();

    // convert chapter id from string into object id
    req.body.chapter._id = new mongo.ObjectId(req.body.chapter._id)

    try {
        // insert new sections
        const insertedSection = await Sections.insertOne({
            title: req.body.title,
            content: req.body.content,
            version: req.body.version,
            chapter: req.body.chapter,
            createdAt: new Date(),
            updatedAt: new Date() 
        })

        // insert new sections into documentations contents
        const result = await Documentation.updateOne(
            {},
            { $push: { "content.$[ct].chapter.$[ch].section": { "_id": insertedSection.insertedId, "title": `${req.body.title}` } } },
            { arrayFilters: [ { "ct.version": `${req.body.version[0]}` }, { "ch._id": req.body.chapter._id } ] }
        )

        // Check if sections failed inserted into documentations content
        if ( result.modifiedCount == 0 ) {
            // Cancel inserting new sections
            await Sections.deleteOne({ _id: insertedSection.insertedId });
            throw new Error ("Error when try to insert section into documentations")
        }

        res.status(201).send({ message : "Sections Data Created!" })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

module.exports = {
    getAllSections,
    getSectionsById,
    createNewSection
}