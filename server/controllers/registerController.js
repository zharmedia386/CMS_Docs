const User = require('../model/users');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const Users = await User()
    const { email, firstname, lastname, username, password } = req.body;
    if (!email || !firstname || !lastname || !username || !password) return res.status(400).json({ 'message': 'Email, Firstname, Lastname, Username and Password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Users.find({ username: username }).toArray();
    console.log(duplicate.length);
    if (typeof duplicate === 'undefined' && duplicate.length !== 0) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await Users.insertOne({
            "email": email,
            "firstname": firstname,
            "lastname": lastname,
            "username": username,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };