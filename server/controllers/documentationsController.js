const documentationDB = require('../model/documentations')
const userCollection = require('../model/users');
const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const getAllDocumentationContent = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        const documentations = await Documentations.find({}).toArray()

        if (!documentations.length) {
            return res.status(200).json([]);
        }

        res.status(200).send(documentations)
    } catch (e) {
        return res.status(500).json({ "message": "Failed to get documentations" });
    }
}

// Get all versions
const getAllVersions = async (req, res) => {
    try {
        const Documentations = await documentationDB()

        const documentations = await Documentations.find({}).project({"content.version": 1}).toArray()

        if (!documentations.length) {
            return res.status(200).json([]);
        }

        res.status(200).send(documentations)
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get all versions" });
    }
}

// Get all Metadatas
const getMetadata = async (req, res) => {
    try {
        const Documentations = await documentationDB()
        const User = await userCollection()

        let webMetadata = await Documentations.find({}).project({
            "title": 1,
            "logo": 1,
            "githubLink": 1,
            "footer": 1
        }).toArray()
        
        let userMetadata = await User.find({}).project({
            "username" : 1
        }).toArray()

        // If database is empty, returns 200 status code with empty array (Tester: Rafli)
        if (webMetadata.length === 0 || userMetadata.length === 0) {
            return res.status(200).send([]);
        }

        res.status(200).send({
            "title" : webMetadata[0].title,
            "logo": webMetadata[0].logo,
            "githubLink": webMetadata[0].githubLink,
            "footer": webMetadata[0].footer,
            "username" : userMetadata[0].username
        })
    } catch (error) {
        return res.status(500).json({ "message": "Failed to get metadata" });
    }
}

const updateMetadata = async (req,res) => {
    const Documentations = await documentationDB()
    const User = await userCollection()

    // Get user data from the session
    const userDataSession = req.session.user;
    
    if (!Documentations || !User) return res.status(204).json({ 'message': 'Metadata not found.'});

    if (!req?.body?.title || !req?.body?.logo || !req?.body?.footer) {
        return res.status(400).json({'message': 'Please fill all required field'});
    }

    try {
        let data = {
            "title" : req.body.title,
            "logo" : req.body.logo,
            "githubLink" : req?.body?.githubLink,
            "footer" : req.body.footer,
            "updatedBy": userDataSession.username
        }
        const updateDoc = await Documentations.updateOne({}, {
            $set : data
        })
        
        let update = {
            updateDoc,
            "message" : "Metadata updated!"
        }
        res.status(200).send(update)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// Create documentation info
const createNewDocumentation = async (req, res) => {
    if (!req?.body?.title || !req?.body?.description || !req?.body?.logo || !req?.body?.footer || !req?.body?.content) {
        return res.status(400).json({ 'message': 'Title, Description, Logo, LogoLink, Footer, Content are required' });
    }

    const Documentations = await documentationDB()

    // Get user data from the session
    const userDataSession = req.session.user;

    // Documentations collection should be only 1 document at a time
    Documentations.countDocuments({}, function(err, count) {
        if(err) throw err;
        else if (count >= 1) {
            res.status(409).send({
                message : "There's already another documentations. Documentation should be only one data/document" 
            })
        }
    })

    try {
        // insert documentation
        const insertedDocumentation = await Documentations.insertOne({
            title : req.body.title,
            logo : req.body.logo,
            description : req.body.description,
            githubLink : req?.body?.githubLink,
            footer : req.body.footer,
            content : req.body.content,
            createdBy: userDataSession.username,
            createdAt : new Date(),
            updatedAt : new Date()
        })

        await Documentations.insertOne(insertedDocumentation)

        res.status(201).send({
            message : "Documentation Data Created!" 
        })
    } catch(err) {
        res.status(400).send({ message: err.message })
    }
}

// Edit documentation info
const updateDocumentation = async (req, res) => {
    if (!req?.body?.title || !req?.body?.description || !req?.body?.logo || !req?.body?.logoLink || !req?.body?.footer) {
        return res.status(400).json({ 'message': 'Title, Description, Logo, LogoLink, Footer are required' });
    }

    const Documentations = await documentationDB()

    // Get user data from the session
    const userDataSession = req.session.user;

    const documentation = {
        title : req.body.title,
        logo : req.body.logo,
        description : req.body.description,
        githubLink : req.body.githubLink,
        footer : req.body.footer,
        updatedAt : new Date(),
        updatedBy: userDataSession.username
    }

    try {
        await Documentations.updateOne(
            {}, 
            {
                $set : documentation
            }
        )
        res.status(200).send({
            message : "Documentation Data Updated!"
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
    
}

// Delete documentation info
const deleteDocumentation = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Documentations ID required.' });

    const Documentations = await documentationDB()
    let objectId = new mongo.ObjectId(req.body.id)

    try {
        await Documentations.deleteOne({
            _id: objectId
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
    
    res.status(201).send({
        message : "Documentation Data Deleted!"
    })
}

module.exports = {
    getAllDocumentationContent,
    getAllVersions,
    createNewDocumentation,
    updateDocumentation,
    deleteDocumentation,
    getMetadata,
    updateMetadata,
}