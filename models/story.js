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
        type: [String],
        required: true,
    },
    titleImg: {
        type: Buffer,
    },
})

module.exports = mongoose.model("Story", storySchema);