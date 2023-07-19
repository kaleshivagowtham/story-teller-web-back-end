const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.use(express.json());

router.post('/checklogin' , (req,res) => {
    const {jwt_auth_token} = req.body;
    // console.log('jwt_auth_token : ',jwt_auth_token);
    console.log('data : ',jwt_auth_token);
    User.findOne({jwt : jwt_auth_token})
    .then(savedUser => {
        console.log("savedUser : ",savedUser);
        if(savedUser)
            return res.status(200).json({response : 'loggedIn',username : savedUser.username});
        else
            return res.status(200).json({response : 'notLoggedIn'});
    })
})

router.post('/signup' , (req , res) => {
    // console.log('details : ',req.body.regDetails);
    const {email,password,fName , mName,lName,username} = req.body.regDetails;
    if((!email && !username) || !fName || !password )
        return res.status(442).json("Please enter all the important details");
    User.findOne({email : email})
        .then(savedUser => {
            if(savedUser)
                return res.status(422).json("The user already exists");
            const accessToken = jwt.sign(username , `${process.env.ACCESS_TOKEN_SECRET}`);
            // console.log('signup Token :', accessToken);
            const user = new User({
                fName : fName,
                mName : mName,
                lName : lName,
                email : email,
                username : username,
                password : password,
                jwt : accessToken
            })
            user.save().then(saved => {
                if(!saved)
                    return res.status(200).json("Some error occurred while");
                return res.status(200).json({'status' : "User saved successfully" , 'jwt_auth_token' : accessToken});
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
            if(savedUser){
                const accessToken = jwt.sign(clientUsername , `${process.env.ACCESS_TOKEN_SECRET}`);
                // console.log(accessToken);
                savedUser.replaceOne({jwt : accessToken})
                .then(done => console.log("done : ",done))
                .catch(err => console.log("Replacing jwt failed"));
                return res.status(200).json({accessToken : accessToken , loginSuccessFul : 'Login successful'});
            }
            return res.status(422).json("username or password incorrect");
        })
})

module.exports = router;