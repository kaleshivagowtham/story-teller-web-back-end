const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/story');

router.post('/newstory', (req , res) => {
    const {writerId , title, paras , titleImg} = req.body.newStory;
    console.log(title);
    console.log(writerId);
    console.log(paras);
    console.log(titleImg);
    if(!title)
        return res.status(422).json("No Title!");
    if(!paras)
        return res.status(422).json("No Content!");
    
    Story.findOne({title : title})
        .then( savedTitle => {
            if(savedTitle)
                return res.status(422).json("Title already exists");
            const story = new Story({
                writerId : writerId,
                title : title,
                paras : paras,
                titleImg : titleImg
            })
            story.save()
                .then(saved => {
                    return res.status(200).json("The story has been saved");
                })
        })
})

router.post('/mystories' , (req , res) => {

    const {writerId} = req.body;
    console.log(writerId);
    if(writerId === '' || writerId == null)
        return res.status(422).json("Please enter an author");
    
    Story.find({writerId : writerId},{projection: {_id : 0}})
    .then(storiesList => {
        if(storiesList.length >= 1)
            return res.status(200).json({storiesList : storiesList});
        else
            return res.status(422).json("No author Found!");
    })
})

module.exports = router;