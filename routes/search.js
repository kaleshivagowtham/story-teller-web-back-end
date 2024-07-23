const express = require('express');
const Story = require('../models/story');
const Chapter = require('../models/chapter');
const User = require('../models/user');

const router = express.Router();

router.post('/search', async (req, res) => {

    const { searchText } = req.body;

    console.log("CALLED", searchText)

    if(searchText === '')
        return;

    let result = {
                stories : '',
                chapters : '',
                users : ''
    };

    // let promise = new Promise( function (resolve, reject) {

        await Story.find({
            $or : [ 
                {storyTitle : { $regex : searchText , $options : 'i'}},
                {tags: searchText}
            ]
        })
        .then( story => {
            if(story)
                result.stories = story;
        })
        .catch(err => {
            console.log("search story error",err.message)
        })
        // ,
        await Chapter.find({title : { $regex : searchText , $options : 'i'}})
        .then( chapters => {
            if(chapters)
                result.chapters = chapters;
        })
        .catch(err => {
            console.log("search story error: ",err.message)
        })
        // ,
        await User.find({username : {$regex : searchText, $options: 'i'}})
        .then( users => {
            if(users)
                result.stories = users;
        })
        .catch(err => {
            console.log("search story error",err.message)
        })
    // }
    // )
    // .then(() => {
    //     return res.status(200).json(result)
    // })
    // .catch((err) => {
    //     return res.status(200).json({"Search error: " : err.message});
    // })
    console.log("Result: ", result);
    return res.status(200).json(result);

})

module.exports = router