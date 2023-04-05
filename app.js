const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Router = require('./Routes/dataroutes');
const app = express();
const cors = require('cors')
app.use(cors());



app.use(bodyparser.json());

const mongourl = "mongodb+srv://karunakar:0VoFTmPbewW8KEFV@cluster0.etvxwbu.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongourl, {
    UseNewUrlParser: true
})
    .then(() => {
        console.log("connected to database");
    })
    .catch((error) => {
        console.log(error);
    })
app.use(express.json());

app.use("/", Router);

app.listen(3000, () => {
    console.log("server is up at 3000");
})