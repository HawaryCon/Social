const PostMessage = require("../models/postMessage.js");
const User = require("../models/user.js");


exports.stat = async (req, res) => {
    try {
        const id = req.userId
        const role = req.role
        if (role != "admin") res.status(404).send("Unauthorized access !");
        const posts = await PostMessage.find()
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

