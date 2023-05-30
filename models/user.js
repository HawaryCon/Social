const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // pic: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Facebook_default_male_avatar.gif"} ,
    pic: String ,
    bio : String,
    id: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    following: [String],
    blocked: [String],
    confirmationCode: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default: 'user'
    }
    
})
module.exports = mongoose.model("User", userSchema);