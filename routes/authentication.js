const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/checkLogin')
require("dotenv").config();

router.use(express.json());

router.get('/checkLogin', auth , (req,res) => {

    try{
        if(req.user)
            return res.status(200).json({'message' : 'loggedIn', username : req.user.username});
        return res.status(200).json({'message' : 'Login failed'});
    }
    catch (error) {
        console.log(error.message);
    }
})

router.post('/signup' , (req , res) => {
    const {email,password,fName , mName,lName,username} = req.body.regDetails;
    console.log(email);
    console.log(mName);
    console.log(username);
    console.log(lName);
    console.log(password);
    if((!email && !username) || !fName || !password )
        return res.status(442).json("Please enter all the important details");
    User.findOne({email : email})
        .then(savedUser => {
            if(savedUser)
                return res.status(422).json("The user already exists");
            const accessToken = jwt.sign(email , `${process.env.ACCESS_TOKEN_SECRET}`);
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

    // console.log("disp: ", clientPassword, clientUsername)
    User.findOne({ $or : [
            {email :clientUsername} , 
            {username : clientUsername}
    ],
            password : clientPassword
        })
        .then((savedUser) => {
            if(savedUser){
                const accessToken = jwt.sign(clientUsername , `${process.env.ACCESS_TOKEN_SECRET}`);
                if(!accessToken)
                    return res.status(200).json({"message" : "Unable to login at the moment"})
                // console.log("Token: ",accessToken);

                savedUser.updateOne({jwt : accessToken})
                .then(done => 
                    console.log("done : ",done)
                )
                .catch(err => 
                    console.log("Replacing jwt failed")
                );
                return res.status(200).json({accessToken : accessToken , username : savedUser.username, loginSuccessFul : 'Login successful'});
            }
            return res.status(200).json("username or password incorrect");
        })
        .catch(err => {
            return res.status(200).json({"message" : err.message})
        })
})

module.exports = router;