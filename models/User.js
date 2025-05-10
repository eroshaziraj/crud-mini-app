const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    body:String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
