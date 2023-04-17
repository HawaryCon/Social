const User = require('../models/user.js');
const mongoose = require('mongoose');
const { config } = require('dotenv');
config();
const fs = require('fs');
const ImageKit = require("imagekit");
const { ObjectId } = require("bson");

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

exports.updateProfile = async (req, res) => {
    try{
    if (!req.userId) return res.json({ message: 'Unauthenticated!' });
    const id = req.userId;
    const name = req.body.name; 
    const bio = req.body.bio; 
    let profile = await User.findById(id);
    if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(404).send(`No profile with id: ${req.userId}`);
    if ((profile["_id"]) != (req.userId)) return res.status(404).send(`Its not your profile`);
    profile.name = name;
    profile.bio = bio;
    //
    if (req.file) {
        var folderName = "images";
        const data = fs.readFileSync(req.file.path);
        imageKit.upload({
            file: data,
            fileName: req.file.originalname,
            folder: folderName
        }, async (err, response) => {
            if (err) {
                return res.status(500).json({
                    status: "failed",
                    message: "An error occured during file upload. Please try again."
                })
            }
            profile.pic = response["url"];

        })
    }
    //
    const result = await User.findByIdAndUpdate(new ObjectId(id), profile, { new: true });
    res.status(200).json(result);
}
catch(error) {
    return res.status(420).json(error)
}
}