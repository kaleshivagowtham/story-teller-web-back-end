const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = require('../models/story');

router.post('/authors' , (req , res) => {
    const {searchText} = req.body;
    // console.log(searchText);
    if(searchText === '' || searchText === null)
        return res.status(422).json("No search performed");
    Story.find({writerId : { $regex : searchText , $options : 'i'}})
    .then((userList) => {
        const authorsList = userList.map(item => item.writerId);
        // console.log(authorsList);
        return res.status(200).json({"authorsList" : authorsList});
    })
})

module.exports = router;