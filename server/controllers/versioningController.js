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

    res.status(201).send({ message: "Berhasil membuat version" })
}

const deleteVersion = async (req, res) => {
    let content = req.body.content

    // Extract only _id of content (chapter, section) and covert it into object id
    content = content.map( ct => ({ 
            version: ct.version, 
            chapter: ct.chapter.map( ch => ({
                    _id: new mongo.ObjectId(ch._id), 
                    section: ch.section.map( sc => ({ 
                            _id: new mongo.ObjectId(sc._id) 
                        }) 
                    )
                }) 
            ) 
        }) 
    )

    const version = content.map(ct => ct.version)
    const chapterId = content.map(ct => ({ version: ct.version, chapter: ct.chapter.map(ch => ch._id) }))
    const sectionId = content.map(ct => ({ version: ct.version, section: ct.chapter.map(ch => ch.section.map(sc => sc._id)).flat() }))
    // console.log(version)
    // console.log(chapterId)
    // console.log(sectionId)

    const Sections = await sectionsDB();
    const Chapter = await chapterDB();
    const Documentation = await documentationDB();

    for(let [verIdx, ver] of version.entries()){
        // Delete version in section
        const sectionInVersion = sectionId[verIdx].section
        await Sections.updateMany(
            { _id: { $in: sectionInVersion} },
            { $pull: { version: ver } }
        )

        // Delete version in chapter
        const chapterInVersion = chapterId[verIdx].chapter
        await Chapter.updateMany(
            { _id: { $in: chapterInVersion } },
            { $pull: { version: ver } }
        )

        // Delete version in documentation
        await Documentation.updateOne(
            {},
            { $pull: { content: { version: ver } } }
        )
    }

    res.status(201).send({ message: "Berhasil menghapus version" })
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
    
    res.status(201).send({ message: "Berhasil mengubah urutan konten dokumentasi" })
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

    res.status(201).send({ message : "Berhasil menambahkan section" })
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

    res.status(201).send({ message : "Berhasil menghapus section" })
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

    res.status(201).send({ message : "Berhasil menambahkan chapter" })
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

    res.status(201).send({ message : "Berhasil menghapus chapter" })
}

module.exports = {
    createVersion,
    deleteVersion,
    reorderDocumentationsContent,
    addSection,
    deleteSection,
    addChapter,
    deleteChapter
}