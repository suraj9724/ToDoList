const mongoose = require('mongoose')

async function connetToMongo() {
    try {
        await mongoose.connect('mongodb://localhost:27017/todo', {})
        console.log("Connected to MongoDB!");
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = connetToMongo;