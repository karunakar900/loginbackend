const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: { type: String, unique: true }
})

const datamodel = mongoose.model("user", userschema);
module.exports = datamodel;