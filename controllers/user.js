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

exports.follow = async (req, res) => {
    try {
        const fid = req.params.id
        if (!req.userId) return res.json({ message: 'Unauthenticated!' });
        if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(404).send(`No profile with id: ${req.userId}`);
        
        const user = await User.findById(req.userId);
        const index = user.following.findIndex((id) => id === (fid))
        if (index === -1) {
            user.following.push(fid);
        } else {
            user.following = user.following.filter((id) => id !== (fid));
        }
        const followedUser = await User.findByIdAndUpdate(new ObjectId(req.userId) , user, { new: true });
        res.status(200).json(followedUser);
    } catch (error) {
        res.status(401).json(error.message)
    }
}
exports.block = async (req, res) => {
    try {
        
        if (!req.userId) return res.json({ message: 'Unauthenticated!' });
        if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(404).send(`No user with id: ${req.userId}`);
        const bid = req.params.id
        const user = await User.findById(req.userId);
        const index = user.blocked.findIndex((id) => id === (bid))
        if (index === -1) {
            user.blocked.push(bid);
        } else {
            user.blocked = user.blocked.filter((id) => id !== (bid));
        }
        const blockedUser = await User.findByIdAndUpdate(new ObjectId(req.userId) , user, { new: true });
        res.status(200).json(blockedUser);
    } catch (error) {
        res.status(401).json(error.message)
    }
}
exports.updateProfile = async (req, res) => {
    try{
    if (!req.userId) return res.json({ message: 'Unauthenticated!' });
    if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(404).send(`No profile with id: ${req.userId}`);
    const id = req.userId;
    const name = req.body.name; 
    const bio = req.body.bio; 
    let profile = await User.findById(id);
    
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

exports.getUser = async (req, res) => {
    const id = req.body.id;
    const u = await User.findById(id);
    res.status(200).json(u);
}