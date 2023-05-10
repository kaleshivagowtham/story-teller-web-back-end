const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

router.post('/signup' , (req , res) => {
    const {email,password,fName} = req.body.regDetails;
    const userName = req.body.regDetails.username;
    if((!email && !userName) || !fName || !password )
        return res.status(442).json("Please enter all the important details");
    User.findOne({email : email})
        .then(savedUser => {
            if(savedUser)
                return res.status(422).json("The user already exists");
            const user = new User({
                fName : fName,
                // mName : mName,
                // lName : lName,
                email : email,
                username : userName,
                password : password
            })
            user.save().then(saved => {
            return res.status(200).json("User saved successfully");
            })
        })
    })

router.post('/signin' , (req , res) => {

    const clientUsername = req.body.username;
    const clientPassword = req.body.password;
    if(!clientUsername || !clientPassword)
        return res.status(422).json("Please enter an email or password");
    User.findOne({email :clientUsername , password : clientPassword})
        .then((savedUser) => {
            if(savedUser)
                return res.status(200).json("Login successful");
            return res.status(422).json("username or password incorrect");
        })
})

module.exports = router;