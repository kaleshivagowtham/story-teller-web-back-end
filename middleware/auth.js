const express = require('express');
const jwt = require('jsonwebtoken');
require("dotenv").config();
// const {ACCESS_TOKEN_SECRET} = require('../nodemon.json');

// module.exports = (req , res,next) => {
//     const authHeared = req.headers['authorization'];
//     const token = authHeared && authHeared.split(' ')[1];
//     if(token == null)
//         return res.status(401).json("Token not found");
//     jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (err , user) => {
//         if(err)
//             return res.status(403).json(err);
//         console.log("User authorized");
//         next();
//     })
// }

module.exports = (req , res,next) => {
    const {jwt_auth_token} = req.body;
    // console.log('jwt_auth_token : ',jwt_auth_token);
    console.log('data : ',req.body);
    User.findOne({jwt : jwt_auth_token})
    .then(savedUser => {
        if(!savedUser)
            return res.status(200).json({response : 'notLoggedIn'});
    })
    next();
}