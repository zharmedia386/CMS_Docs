const chapterDB = require('../model/chapters')
const sectionsDB = require('../model/sections')
const documentationDB = require('../model/documentations')
const mongo = require('mongodb')

// Get all chapters info
const getAllChapters = async (req, res) => {
    const Chapters = await chapterDB()
    if (!Chapters) return res.status(204).json({ 'message': 'Chapter tidak ditemukan.' });

    res.status(200).send(await Chapters.find({}).toArray())
}

// Get specified chapters info
const getChaptersById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Masukan Chapter ID.' });

    const Chapters = await chapterDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Chapters) {
        return res.status(204).json({ "message": `Chapter tidak cocok dengan ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Chapters.find({_id : objectId}).toArray())
}

// Create chapters info
const createNewChapter = async (req, res) => {
    // cek field
    if (!req?.body?.title || !req?.body?.version) {
        return res.status(400).json({ 'message': 'Judul dan Versi harus diisi' });
    }

    const Chapters = await chapterDB();
    const Documentation = await documentationDB();

    try {
        // masukan chapter baru
        const insertedChapter = await Chapters.insertOne({
            title: req.body.title,
            version: req.body.version,
            createdAt: new Date(),
            updatedAt: new Date() 
        })

        // masukan chapter baru didalam dokumen
        const result = await Documentation.updateOne(
            { content: { $elemMatch: { "version": `${req.body.version[0]}` } } },
            { $push: { "content.$.chapter": { "_id": insertedChapter.insertedId, "title": `${req.body.title}` } } }
        )

        // cek ketika chapter baru dimasukan kedalam dokumen
        if ( result.modifiedCount == 0 ) {
            // Cancel inserting new sections
            await Chapters.deleteOne({ _id: insertedChapter.insertedId });
            throw new Error ("Error ketika memasukan chapter")
        }

        res.status(201).send({ message : "Chapter berhasil dibuat!" })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

const updateChapter = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Chapter ID harus diisi.' });

    if (!req?.body?.title) {
        return res.status(400).json({ 'message': 'Judul harus diisi' });
    }

    let chapterId = new mongo.ObjectId(req.body.id)

    const Chapters = await chapterDB();
    const Documentation = await documentationDB();

    const chapter = {
        title: req.body.title,
        updatedAt: new Date() 
    }

    try {
        // update chapter
        await Chapters.updateOne(
            { _id: chapterId },
            { $set: chapter }
        )
        
        // update judul chapter
        await Documentation.updateOne(
            { "content.chapter._id": chapterId },
            { $set: { "content.$[c].chapter.$[ch].title": `${chapter.title}` } },
            { arrayFilters: [ { "c.chapter._id": chapterId }, { "ch._id": chapterId } ] }
        )
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(201).send({ message : "Chapter Diperbaharui!" })
}

const deleteChapter = async (req, res) => {
    let content = req.body.content;
    let chapterId = req.body.chapterId;

    const section = []

    for (const ct of content) {
        // Cek jka chapter sudah ada
        if(!ct?.chapter) { break }

        const chapter = ct.chapter.find((c) => c._id == chapterId)

        if(!chapter?.section) { continue }

        const sectionId = chapter.section.map((sc) => new mongo.ObjectId(sc._id))

        section.push({version: ct.version, section: sectionId})
    }

    chapterId = new mongo.ObjectId(chapterId);

    const Sections = await sectionsDB();
    const Chapter = await chapterDB();
    const Documentation = await documentationDB();

    try {
        // menghapus chapter di colection
        let result = await Chapter.deleteOne(
            { _id: chapterId }
        )

        // menghapus chapter di struktur dokumentasi
        result = await Documentation.updateOne(
            {},
            { $pull: { "content.$[].chapter": { _id: chapterId } } }
        )

        // Delete version from chapter in section
        for (const sc of section) {
            result = await Sections.updateMany(
                { _id: { $in: sc.section } },
                { $pull: { version: sc.version } }
            )
        }
    } catch (error) {
        res.status(400).send({ message: error.message })
    }

    res.status(201).send({ message : "Berhasil menghapus chapter" })
}

module.exports = {
    getAllChapters,
    getChaptersById,
    createNewChapter,
    updateChapter,
    deleteChapter
}