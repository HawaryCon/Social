const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    file: String,
    likes: {
        type: [String],
        default: [],
    },
    comments: [{ body: String, uid: String}],
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

module.exports = mongoose.model("PostMessage", postSchema);