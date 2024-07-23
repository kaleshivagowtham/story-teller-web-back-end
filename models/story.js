const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({

    writerId: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        required: true,
    },
    paras: {
        type: String,
        required: true,
    },
    titleImg: {
        type: String,
        required : true
    },
    tags : {
        type : [String],
        required : true
    },
    firstChapter : {
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
    chapters : {
        type : [{
            chapterId : {
                type : String
            },
            chapterTitle : {
                type : String
            },
        }],
    },
    comments : {
        type : [String]
        // type: [{
        //     commentBy : {
        //         type : String,
        //         required: true
        //     },
        //     comment : {
        //         type : String,
        //         required: true
        //     },
        //     date : {
        //         type : String,
        //         required: true
        //     },
        //     time : {
        //         type : String,
        //         required: true
        //     }
        // }]
    }
})

module.exports = mongoose.model("Story", storySchema);