const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');

router.use(express.json());

router.post('/dpupload', (req , res)=> {

    // const {filename , path} = req.file;
    // console.log('dpImg Name : ',filename);
    // console.log('dpImg path : ',path);
    console.log(req.body);
    console.log(req);
    return res.status(200).json('Image uploaded successfully');
})

// router.use('/uploads', express.static('uploads'));

module.exports = router;