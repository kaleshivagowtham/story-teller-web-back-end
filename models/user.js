const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName : {
        type : String,
        required : true,
    },
    mName : {
        type : String,
    },
    lName : {
        type : String,
    },
    email : {
        type : String,
        required : true,
    },
    username : {
        type : String,
    },
    password : {
        type : String,
        required : true,
    },
    jwt : {
        type : String,
    },
    avatar : {
        type : Buffer,
    }
})

module.exports = mongoose.model("User" , userSchema);