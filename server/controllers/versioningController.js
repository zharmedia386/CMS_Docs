const mongo = require('mongodb')
const sectionsDB = require('../model/sections')
const chapterDB = require('../model/chapters')
const documentationDB = require('../model/documentations')

const createVersion = async (req, res) => {
    const versionName = req.body.versionName

    const Documentation = await documentationDB();

    try {
        // updating chapter title in documentation content
        await Documentation.updateOne(
            {},
            { $push: { "content": { version: versionName } } }
        )
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(200).send({ message: "Version created" })
}

const reorderDocumentationsContent = async (req, res) => {
    if (!req?.body?.content) return res.status(400).json({ 'message': 'Documentations content required.' });

    let content = req.body.content
    
    // convert _id string to object id
    for (ct of content) {
        for (ch of ct.chapter) {
            ch._id = new mongo.ObjectId(ch._id)
            for (sc of ch.section) {
                sc._id = new mongo.ObjectId(sc._id)
            }
        }
    }

    const Documentation = await documentationDB();

    try {
        // updating chapter title in documentation content
        await Documentation.updateOne(
            {},
            { $set: { "content": content } }
        )
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
    
    res.status(200).send({ message: "Documentation content updated" })
}

const addSection = async (req, res) => {
    const sections = req.body.sections.map(section => ({_id: new mongo.ObjectId(section._id), title: section.title}));
    const sectionsId = sections.map(section => section._id)
    const chapterId = new mongo.ObjectId(req.body.chapter)
    let version = req.body.version;

    const Sections = await sectionsDB();
    const Documentation = await documentationDB();

    try {
        let result = await Sections.updateMany(
            { _id: { $in: sectionsId } },
            { $push: { version: version } }
        )
        console.log('update ke section collection')
        console.log(result)

        
        result = await Documentation.updateOne(
            {},
            { $push: { "content.$[ct].chapter.$[ch].section": { $each: sections } } },
            { arrayFilters: [ { "ct.version": version }, { "ch._id": chapterId } ] }
        )
        console.log('update ke documentation section')
        console.log(result)

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(201).send({ message : "Sections version updated!" })
}

const deleteSection = async (req, res) => {
    const version = req.body.version;
    const sectionId = new mongo.ObjectId(req.body.sectionId)

    const Sections = await sectionsDB();
    const Documentation = await documentationDB();

    try {
        let result = await Sections.updateOne(
            { _id: sectionId },
            { $pull: { version: version } }
        )
        console.log('update ke section collection')
        console.log(result)

        
        result = await Documentation.updateOne(
            {},
            { $pull: { "content.$[ct].chapter.$[].section": { _id: sectionId } } },
            { arrayFilters: [ { "ct.version": version } ] }
        )
        console.log('update ke documentation section')
        console.log(result)

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(200).send({ message : "Sections deleted" })
}

const addChapter = async (req, res) => {
    const chapters = req.body.chapters.map(ch => ({_id: new mongo.ObjectId(ch._id), title: ch.title}));
    const chaptersId = chapters.map(ch => ch._id)
    const version = req.body.version;

    console.log(chapters)
    console.log(chaptersId)
    console.log(version)

    const Chapter = await chapterDB();
    const Documentation = await documentationDB();

    try {
        let result = await Chapter.updateMany(
            { _id: { $in: chaptersId } },
            { $push: { version: version } }
        )
        console.log('update ke chapter collection')
        console.log(result)

        
        result = await Documentation.updateOne(
            {},
            { $push: { "content.$[ct].chapter": { $each: chapters } } },
            { arrayFilters: [ { "ct.version": version } ] }
        )
        console.log('update ke documentation chapter')
        console.log(result)

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(201).send({ message : "Chapter version updated!" })
}

const deleteChapter = async (req, res) => {
    const version = req.body.version;
    const chapterId = new mongo.ObjectId(req.body.chapterId)
    const sectionsId = req.body.sectionsId.map(id => new mongo.ObjectId(id))

    const Sections = await sectionsDB();
    const Chapter = await chapterDB();
    const Documentation = await documentationDB();

    try {
        let result = await Chapter.updateOne(
            { _id: chapterId },
            { $pull: { version: version } }
        )
        console.log('update ke chapter collection')
        console.log(result)

        result = await Documentation.updateOne(
            {},
            { $pull: { "content.$[ct].chapter": { _id: chapterId } } },
            { arrayFilters: [ { "ct.version": version } ] }
        )
        console.log('update ke documentation section')
        console.log(result)

        result = await Sections.updateMany(
            { _id: { $in: sectionsId } },
            { $pull: { version: version } }
        )
        console.log('update ke section collection')
        console.log(result)

    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(200).send({ message : "Sections deleted" })
}

module.exports = {
    createVersion,
    reorderDocumentationsContent,
    addSection,
    deleteSection,
    addChapter,
    deleteChapter
}