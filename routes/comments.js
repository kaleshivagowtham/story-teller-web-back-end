const express = require('express');
const Comment = require('../models/comments');
const Story = require('../models/story');
const auth = require('../middleware/checkLogin');
const comments = require('../models/comments');

const router = express.Router();

router.post('/newComment', auth, async (req, res) => {

    const {newComment, storyTitle} = req.body;

    const comment = new Comment({
        writerId : req.user.username ,
        comment : newComment,
    })
    await comment.save()
        .then(saved => {
            if(!saved)
                return res.status(200).json({"message" : "There was some error"})

            Story.findOneAndUpdate({title : storyTitle},
                {$push : {comments : saved._id}},
                {new : true}
            )
            .then(pushed => {
                if(!pushed){
                    console.log("Pushed: ", pushed)
                    return res.status(200).json({"message" : "There was some error"})
                }
                return res.status(200).json({"message" : "Comment posted"})
            })
            .catch(err => {
                console.log("Error1: ",err)
            })
            
        })
        .catch(err => {
            console.log("Error2: ",err.message)
        })
})

router.post('/replyComment', auth, (req, res) => {

    const {writerId, comment, replyTo} = req.body;

    // console.log(writerId, comment, replyTo)

    const newComment = new Comment({
        writerId,
        comment,
        replyTo
    })

    newComment.save()
        .then(saved => {
            Comment.findOneAndUpdate({_id: replyTo},
                {$push : { reply : saved._id }},
                {new : true}
            )
            .then(savedComment => {
                if(!savedComment)
                        return res.status(200).json({"message" : "There seems to be some error"})

                return res.status(200).json(savedComment)
            })
            .catch(err=> {
                return res.status(200).json({"message" : err.message})
            })
        })
    
})

router.post('/getComment', (req, res) => {

    const { commentId } = req.body;

    Comment.findById(commentId)
    .then(comment => {
        return res.status(200).json(comment)
    })
    .catch(err => {
        console.log("Error: ", err.message)
    })
})

router.post('/deleteComment', auth, async (req, res) => {

    const { commentId } = req.body;

    await Comment.findById(commentId)
    .then(comment => {
        if(!comment)
            return res.status(200).json({"message" : "There seems to be some error"})

        // Comment.findById(replyTo)
        // .then(replyOf => {
            
        // })
        // .catch(err => {
        //     console.log("Error: ", err.message)
        // })

        comment.reply?.map((eachCommentId) => {
            Comment.findByIdAndDelete(eachCommentId)
            .then(deleted => {
                if(!deleted)
                    return res.status(200).json({"message" : "There seems to be some error"})

                console.log("Comment Deleted")
            })
            .catch(err => {
                return res.status(200).json({"message" : err.message})
            })
        })

        // return res.status(200).json({"message" : "Comment Deleted"})
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message})
    })

    Comment.findByIdAndDelete(commentId)
    .then(deleted => {
        if(!deleted)
            return res.status(200).json({"message" : "There seems to be some error"})

        return res.status(200).json({"message" : "Comment Deleted"})
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message})
    })

    Comment.findByIdAndDelete(commentId)
    .then(deleted => {
        if(!deleted)
            return res.status(200).json({"message" : "There seems to be some error"})

        return res.status(200).json({"message" : "Comment Deleted"})
    })
    .catch(err => {
        return res.status(200).json({"message" : err.message})
    })
})

module.exports = router;