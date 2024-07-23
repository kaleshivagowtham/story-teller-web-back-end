const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const mongoose = require('mongoose');

router.use(express.json());

router.get('/trending', (req, res) => {

    try{
        Story.find().limit(10)
        .then(stories => {
            if(stories)
                return res.status(200).json(stories)
            return res.status(200).json({message :"Looks like there was some error"})
        })
        .catch(err => {
                return res.status(200).json({message : "there was an error"});
            })
    }
    catch(err){
        return res.status(200).json({message : "there was an error"});
    }
})

module.exports = router;