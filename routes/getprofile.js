const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const router = express.Router();

router.post('/profileinfo' , (req,res) => {
    const profileInfo = req.body.profileInfo;
    console.log("profileInfo : ",profileInfo);
    User.find({username : profileInfo})
    .select('fName email username')
    .then((user) => {
        // const sendData = {fName : user.fName,
        //                 email : user.email,
        //                 username : user.username,
        //             }
        // console.log(sendData);
        console.log('user : ',user);
        return res.status(200).json({user});
    })
    .catch((err) => console.log(err))
    // return res.status(200).json('Not Found');
})

module.exports = router;