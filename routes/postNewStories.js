const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/story');
const User = require('../models/user');
const authenticateToken = require('../middleware/auth');
const auth = require('../middleware/checkLogin');

router.post('/newstory', auth, async (req , res) => {
    const {writerId , title, paras , titleImg, tags} = req.body.newStory;
    console.log(title);
    console.log(writerId);
    console.log(paras);
    console.log(titleImg);
    if(!title)
        return res.status(422).json("No Title!");
    if(!paras)
        return res.status(422).json("No Content!");

    if(req.user.username !== writerId)
        return res.status(200).json({"message" : "Couldn't post"})
    
    Story.findOne({title : title})
        .then( savedTitle => {
            if(savedTitle)
                return res.status(422).json("Title already exists");
            const story = new Story({
                writerId ,
                title ,
                paras ,
                titleImg ,
                tags ,
                firstChapter : null
            })
            story.save()
                .then(saved => {
                    if(!saved)
                        return res.status(200).json({message : 'Story not saved'})
                    return res.status(200).json({message:"Story saved"});
                })
        })
})

router.post('/mystories' , auth, (req , res) => {

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

router.post('/newpost', authenticateToken , (req , res ) => {
    console.log('post called');
    return res.status(200).json("Post called");
})

module.exports = router;