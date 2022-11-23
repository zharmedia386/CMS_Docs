const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const Users = await User()
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
    
    const foundUser = await Users.find({ username: user }).toArray();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    
    // evaluate password 
    // console.log(pwd)
    // console.log(foundUser[0].password)
    const match = await bcrypt.compare(pwd, foundUser[0].password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser[0].save();
        console.log(result);
        
        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        
        // Send authorization roles and access token to user
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };