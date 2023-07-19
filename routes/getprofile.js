const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();

router.post('/profileinfo' , (req,res) => {
    const profileInfo = req.body.profileInfo;
    console.log("profileInfo : ",profileInfo);
    User.find({username : profileInfo})
    .then((user) => {
        console.log(user);
        return res.status(200).json({user});
    })
    .catch((err) => console.log('err'))
    // return res.status(200).json('Not Found');
})

module.exports = router;