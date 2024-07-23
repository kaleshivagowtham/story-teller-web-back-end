const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = require('../models/user')
require('dotenv').config();

module.exports = (req, res, next) => {

    try {
        const authorization = JSON.parse(req.headers.authorization);

        if (!authorization)
            return res.status(200).json({ authorized: false })

        if(authorization) {
            jwt.verify( authorization, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
                if (err) {
                    return res.status(200).json({ authorized: false, err : err })
                } else {
                    await User.find({
                        $or : [
                            {email : data},
                            {username : data}
                        ]
                    })
                    .then (user => {
                        if (user) {
                            // console.log(user)
                            req.user = user[0];
                            next();
                        }
                        else 
                            return res.status(200).json({ "message" : "You are not authorized to take the action" })
                    })
                    .catch(err => {
                        return res.status(200).json({message : err.message});
                    })
                }
            })
        }
    }
    catch(err) {
        return res.status(200).json({"error Here" : err});
    }
}