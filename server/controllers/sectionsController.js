const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all sections info
const getAllSections = async (req, res) => {
    try {
        const Sections = await sectionsDB();

        const sections = await Sections.find({}).toArray();

        if (!sections.length) {
            return res.status(200).json([]);
        }

        res.status(200).send(sections);
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get sections" });
    }
}

// Get specified sections info
const getSectionsById = async (req, res) => {
    try {
        const sectionId = req.params.id;
        const Sections = await sectionsDB();

        // Convert section id to mongo object id
        let objectId = new mongo.ObjectId(sectionId);

        const sections = await Sections.find({_id : objectId}).toArray();

        if(!sections.length){
            return res.status(404).json({ "message": `No sections matches ID ${sectionId}.` });
        }
        
        res.status(200).send(sections);
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get section" });
    }
}

// Create documentation info
const createNewSection = async (req, res) => {
    const Sections = await sectionsDB()

    // Get user data from the session
    const userDataSession = req.session.user;
    if(!userDataSession) {
        return res.status(404).send({ message: "Unauthorized" });
    }

    try {
        // insert new sections
        let section = {
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userDataSession.username,
        }
        if(req.body.alias && req.body.alias.length != 0) section.alias = req.body.alias;
        const insertedSection = await Sections.insertOne(section)

        res.status(200).send({ message : "Sections Data Created!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const updateSection = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Sections ID required.' });

    if (!req?.body?.title || !req?.body?.content) {
        return res.status(400).json({ 'message': 'Title and content is required' });
    }

    let sectionId = new mongo.ObjectId(req.body.id)

    const Sections = await sectionsDB()

    // Get user data from the session
    const userDataSession = req.session.user;

    let section = {
        title: req.body.title,
        content: req.body.content,
        updatedBy: userDataSession.username
    }

    if(req.body.alias && req.body.alias.length != 0) section.alias = req.body.alias;

    try {
        // update section in section collections
        await Sections.updateOne(
            { _id: sectionId },
            { $set: section }
        )
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
    res.status(201).send({ message : "Sections Data Updated!" })
}

const deleteSection = async (req, res) => {
    console.log(req.body) 
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Sections ID required.' });
    
    let sectionId = new mongo.ObjectId(req.body.id)

    const Sections = await sectionsDB()
    const Documentation = await documentationDB();

    try {
        // update section in section collections
        await Sections.deleteOne(
            { _id: sectionId }
        )
        
        // updating section title in documentation content
        await Documentation.updateOne(
            { "content.chapter.section._id": sectionId },
            { $pull: { "content.$[].chapter.$[].section": { "_id": sectionId } } }
        )
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(201).send({ message : "Sections Data Deleted!" })
}

module.exports = {
    getAllSections,
    getSectionsById,
    createNewSection,
    updateSection,
    deleteSection
}