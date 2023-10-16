const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url, {}) // what goes inside the empty curly brackets are the options to change the connection of the url itself, anything to modify the database aka options i.e only read and not write
}

module.exports = connectDB;