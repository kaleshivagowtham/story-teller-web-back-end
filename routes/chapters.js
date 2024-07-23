const express = require('express');
const Chapter = require('../models/chapter');
const Story = require('../models/story');
const User = require('../models/user')
const auth = require('../middleware/checkLogin');

const router = express.Router();

router.post('/getAllChapters', async (req, res) => {

    const {title} = req.body;

    Story.find({title})
    .then(story => {
        console.log(story.chapters);
        if(!story)
            return res.status(200).json({"message" : "No story found"})
        return res.status(200).json({"novel" : story});
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message})
    })
})

router.post('/getChapter', async (req, res) => {

    const {storyTitle, chapterNumber} = req.body;
    console.log(storyTitle, chapterNumber)

    Chapter.findOne({storyTitle, chapterNumber})
    .then(chapter => {
        if(!chapter)
            return res.status(200).json({"message" : "No chapter found"})
        else{
            User.findOne({username : chapter.writerId})
            .then((user) => {
                if(!user)
                    return res.status(200).json(chapter);
                else
                    return res.status(200).json({chapter, avatar : user.avatar});
            })
        }
        // return res.status(200).json(chapter);
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message})
    })
})

router.post('/newChapter', auth, async (req, res) => {
    const {writerId , title, paras, storyTitle, chapterNumber } = req.body.newStory;

    // console.log(title);
    // console.log(writerId);
    // console.log(paras);

    if(!title || !storyTitle)
        return res.status(200).json("No Title!");
    if(paras.length === 0)
        return res.status(200).json("No Content!");
    if(!chapterNumber || chapterNumber < 1)
        return res.status(200).json("No chapter number")

    if(writerId !== req.user.username)
        return req.status(200).json({"message" : "You don't have access to this"})

    await Chapter.findOne({storyTitle, title, chapterNumber})
    .then((existingChapter) => {
        if(existingChapter)
            return res.status(200).json({"message" : "Chapter already exists!"});
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message});
    })

    const chapter = new Chapter({
        writerId ,
        storyTitle ,
        title ,
        paras ,
        chapterNumber,
        previousChapter : null ,
        nextChapter : null
    })
    await chapter.save()
        .then(saved => {
            if(!saved)
                return res.status(200).json({message : "Couldn't save"})

            if(chapterNumber != 1) {
                Chapter.findOneAndUpdate({storyTitle, chapterNumber : chapterNumber - 1, writerId},
                    {nextChapter : saved._id},
                    {new : true}
                )
                .then((updatedChapter) => {
                    if(!updatedChapter)
                        return res.status(200).json({message : "Couldn't update previous chapter"});

                    Chapter.findOneAndUpdate({storyTitle, chapterNumber : chapterNumber},
                        {previousChapter : updatedChapter._id},
                        {new : true},
                    )
                    .then(() => {
                        console.log("Updated: ",updatedChapter)
                    })
                    .catch(err => {
                        return res.status(200).json({message : err.message})
                    })
                })
                .catch(err => {
                    console.log("Failed to link to previous chapter")
                        return res.status(200).json({message : err.message});
                })
                Story.findOneAndUpdate({title : storyTitle},
                    {
                        $push : {
                            chapters : {
                                chapterId : saved._id,
                                chapterTitle : title
                            }
                        }
                    },
                    {new : true}
                )
                .then((updated) => {
                    // console.log(updated);
                    // return res.status(200).json(updated);
                })
                .catch(err => {
                    return res.status(200).json({message : err.message});
                })
            }
            else if(chapterNumber == 1) {
                Story.findOneAndUpdate({title : storyTitle},
                    {
                        firstChapter : saved._id , 
                        $push : {
                            chapters : {
                                chapterId : saved._id,
                                chapterTitle : title
                            }
                        }
                    },
                    {new : true}
                )
                .then((updated) => {
                    // console.log("Update: ",updated);
                    // return res.status(200).json(updated);
                })
                .catch(err => {
                    return res.status(200).json({message : err.message});
                })
            }
            return res.status(200).json({message:"Chapter saved"});
        })
        .catch(err => {
            return res.status(200).json({message : err.message})
        })
})

router.post('/updateChapter', auth, async (req, res) => {
    const {writerId , title, paras, storyTitle, chapterNumber } = req.body.newStory;

    // console.log(title);
    // console.log(writerId);
    // console.log(paras);

    if(!title || !storyTitle)
        return res.status(200).json("No Title!");
    if(paras.length === 0)
        return res.status(200).json("No Content!");
    if(!chapterNumber || chapterNumber < 1)
        return res.status(200).json("No chapter number")

    await User.findOne({email : req.user.email})
    .then((user) => {
        if(!user)
            return req.status(200).json({"message" : "You don't have access to this"})

        if(user.username !== writerId)
            return req.status(200).json({"message" : "You don't have access to this"})
    })
    .catch(err => {
        return req.status(200).json({"Error: ":err.message})
    })

    await Chapter.findOneAndUpdate({storyTitle, writerId, chapterNumber : chapterNumber},
        {title, paras},
        {new : true},
    )
    .then(() => {
        console.log("Updated: ",updatedChapter)
    })
    .catch(err => {
        return res.status(200).json({message : err.message})
    })
})

module.exports = router;