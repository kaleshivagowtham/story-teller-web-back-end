const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/story');
const authenticateToken = require('../middleware/auth');
const User = require('../models/user');

router.post('/getstory', (req, res) => {
    try {
        const {storyTitle} = req.body;

        Story.findOne({title : storyTitle}).select('-_id')
        .then(story => {
            console.log("Story: ", story)
            if(story){
                User.findOne({username : story.writerId})
                .then((user) => {
                    if(!user)
                        return res.status(200).json(story);
                    else
                        return res.status(200).json({story, avatar : user.avatar});
                })
                // return res.status(200).json(story);
            }
            else
                return res.status(200).json({"message" : "Story not found"});
        })
    }
    catch(err){
        console.log(err.message)
    }
})


router.put('/checkliked', (req,res) => {
    const {userName, storyTitle} = req.body;
    Story.updateOne({storyTitle : storyTitle , likes : {$ne : userName}},
        {$push: {likes : userName}},
        {new : true},
        (err, updatedStory) => {
                console.log("It has been called: ",userName," ",storyTitle);
            if(err){
                console.log("error bro error")
                return res.status(500).json({'status' : 'Error occurred'});
            }
            if(updatedStory) {
                console.log("updatedStory: ",updatedStory);
                return res.status(200).json({'status':'Liked Successfully', 'content' : updatedStory});
            }
            else{
                console.log("already exists bro")
                return res.status(400).json({'status' : 'already liked'});
            }
        })
})


module.exports = router;