const UserDB = require('../model/users');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const mongo = require('mongodb')

const getAllUsers = async (req, res) => {
    const Users = await UserDB();
    if (!Users) return res.status(204).json({ 'message': 'No users found' });
    res.status(200).send(await Users.find({}).toArray())
}

const getUserById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Users ID required.' });

    const Users = await UserDB()
    let objectId = new mongo.ObjectId(req.params.id)

    if (!Users) {
        return res.status(204).json({ "message": `No users matches ID ${req.params.id}.` });
    }
    
    res.status(200).send(await Users.find({_id : objectId}).toArray())
}

const getUserByUsername = async (req, res) => {
    if (!req?.params?.username) return res.status(400).json({ 'message': 'Username required.' });

    const Users = await UserDB()

    if (!Users) {
        return res.status(204).json({ "message": `No users matches usernames ${req.params.username}.` });
    }
    
    res.status(200).send(await Users.find({username : req.params.username}).toArray())
}

const updateUser = async (req,res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Users ID required.' });

    if(!req?.body?.email || !req?.body?.firstname || !req?.body?.lastname || !req?.body?.username) {
        return res.status(400).json({'message': 'Please fill all required field'});
    }

    let userId = new mongo.ObjectId(req.body.id)

    const Users = await UserDB()

    // Get user data from the session
    const userDataSession = req.session.user;

    let userData = {
        "email" : req.body.email,
        "firstname" : req.body.firstname,
        "lastname" : req.body.lastname,
        "username" : req.body.username,
        "updatedBy": userDataSession.username
    }

    if(req.body.alias && req.body.alias.length != 0) userData.alias = req.body.alias;

    try {
        // update users in users collections
        await Users.updateOne(
            { _id: userId },
            { $set: userData }
        )
    } catch (error) {
        res.status(400).send(error.message)
    }
    res.status(201).send({ message : "Users Data Updated!" })
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'UserDB ID required' });
    const user = await UserDB.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `UserDB ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const resetPassword = async (req, res) => {
    if(!req?.body?.email) return res.status(400).json({"message" : "Email is required"})

    const Users = await UserDB()

    if (!Users) return res.status(204).json({ 'message': 'No user found.' });

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newPassword = ""
    for(let i = 0; i < 10; i++){
        newPassword += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    try {
        let [user] = await Users.find().toArray()
        const update = await Users.updateOne({}, {
            $set : {
                "password" : await bcrypt.hash(newPassword, 10)
            }
        })
        if(update.modifiedCount == 1){
            const transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "0330f88642c22f",
                  pass: "7abf325262f679"
                }
            });

            const send = transport.sendMail({
                from: '"CMS Team" <cmsteam@example.com>',
                to : req.body.email,
                subject: "Reset Password",
                text: "New Password : " + newPassword,
                html: "<h1>New Password : " + newPassword + "</h1>"
            })
            console.log(newPassword)
            res.status(200).send({
                "message" : "Reset password success!"
            })
        }
        else{
            throw "Reset password failed!"
        }
        
    } catch (error) {
        res.status(400).send({"message" : error.message})
    }
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    getUserByUsername,
    resetPassword
}