const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({

    storyTitle : {
        type : String,
        required : true,
    },
    writerId: {
        type: String,
        require: true,
    },
    chapterNumber : {
        type : String,
        required : true
    },
    title: {
        type: String,
        required: true,
    },
    paras: {
        type: [{
            'type' : {
                type : String,
                required : true,
            },
            content : {
                type : String,
                required : true
            }
        }],
        required: true,
    },
    previousChapter : {
        type : String
    },
    nextChapter : {
        type : String
    },
    likes : {
        type: [String],
        default: 0
    },
    createdOn : {
        type : String,
        // required : true
    },
    comments : {
        type: [{
            commentBy : {
                type : String,
                // required: true
            },
            comment : {
                type : String,
                // required: true
            },
            date : {
                type : String,
                // required: true
            },
            time : {
                type : String,
                // required: true
            }
        }]
    }
})

module.exports = mongoose.model("Chapter", chapterSchema);