const mongo = require('mongodb')
const sectionsDB = require('../model/sections')
const chapterDB = require('../model/chapters')
const documentationDB = require('../model/documentations')

const test = async (req, res) => {
    res.status(200).send({ message : "success getted" })
}

const reorderDocumentationsContent = async (req, res) => {
    if (!req?.body?.content) return res.status(400).json({ 'message': 'Documentations content required.' });

    let content = req.body.content
    console.log(content)

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

module.exports = {
    test,
    reorderDocumentationsContent,
    addSection,
    addChapter
}