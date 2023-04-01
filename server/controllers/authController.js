const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const Users = await User()
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Masukan Username dan Password.' });
    
    let foundUser = await Users.find({ username: user }).toArray();
    if (!foundUser) return res.sendStatus(401);

    // Create a copy of foundUser and delete the password field
    let foundUserWithoutPassword = {
        ...foundUser[0],
        password: undefined
      };
    
    if(!foundUser[0]) {
        res.sendStatus(401)
    }

    const match = await bcrypt.compare(pwd, foundUser[0].password);
    if (match) {
        const accessToken = jwt.sign(
            { "username": foundUser[0].username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser[0].username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const result = await Users.updateOne(
            { _id: foundUser[0]._id },
            { $set: { refreshToken: refreshToken } }
          );

        // Set user data in the session
        req.session.user = foundUserWithoutPassword;
        
        res.json({ accessToken, user: foundUserWithoutPassword });
    } else {
        res.sendStatus(401);
    }
}

const checkToken = async (req,res) => {
    const Users = await User()
    const token = req.params.token
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let foundUser = await Users.find({ username: decoded.username }).toArray();
        if (!foundUser) return res.status(401).send("Username Tidak Ditemukan");
        const accessToken = jwt.sign(
            { "username": decoded.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        res.status(200).send(accessToken)
    } catch (err) {
        res.status(401).send(err.message)
    }
}

module.exports = { handleLogin, checkToken };