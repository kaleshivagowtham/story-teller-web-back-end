const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    writerId: {
        type : String,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    reply : {
        type : [String]
    },
    replyTo : {
        type : String,
    }
})

module.exports = mongoose.model("Comment", commentSchema)