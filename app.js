const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');

app.use(cors());


const PORT = 5000;

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://0.0.0.0:27017/story-teller-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.connection.on('connected' , () => {
    console.log("Db connected successfully");
})
mongoose.connection.on('error' , (err) => {
    console.log("Error occured :",err);
})

app.use(express.json());
app.use(require('./routes/authentication'));
app.use(require('./routes/postNewStories'));
app.use(require('./routes/authors'));
app.use(require('./routes/profile'));
app.use(require('./routes/getprofile'));

app.get('/' , (req , res) => {
    console.log("Home content");
    res.send("Hello world");
})


app.listen( PORT , () => {
    console.log(`Server started on PORT: ${PORT}...`);
})