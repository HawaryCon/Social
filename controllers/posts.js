const PostMessage = require("../models/postMessage.js");
const mongoose = require('mongoose');

const { config } = require('dotenv');
config();
const fs = require('fs');
const ImageKit = require("imagekit")
const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

exports.createPost = async (req, res) => {
    if (!req.userId) return res.json({ message: 'Unauthenticated!' });
    const uid = req.userId;
    
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
            const title= req.body.title;
            const message = req.body.message;
            const tags = req.body.tags;
            const file = response["url"];
            const newPostMessage = new PostMessage({ title: title, message: message, tags: tags, creator: uid , file : file });
            const savedPost = await newPostMessage.save();
            console.log("sha8al")
            res.status(201).json(savedPost);
            //res.json({ status: "success", url: response, message: "Successfully uploaded files" });
        })
    }
    else{
        
        try {
            const title = req.body.title;
            const message = req.body.message;
            const tags = req.body.tags;
            const newPostMessage = new PostMessage({ title: title, message: message, tags: tags, creator: req.userId })
            await newPostMessage.save();
            res.status(201).json(newPostMessage);
            console.log("sha8al22")
        } catch (error) {
            res.status(409).json({ message: error.message });
        }
    }
    
    
    
}
exports.homePage = async (req, res) => {
    try {
        const id = req.userId
        const posts = await PostMessage.find({ creator: { $ne: id } })
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.myProfile = async (req, res) => {
    try {
        const id = req.params.id
        const post = await PostMessage.find({ creator: id })
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.getProfile = async (req, res) => {
    try {
        const id = req.userId
        const post = await PostMessage.find({ creator: id })
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.getPost = async (req, res) => {
    try {
        const id = req.params.id
        const post = await PostMessage.findById(id)
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
exports.likePost = async (req, res) => {
    try{
        const id  = req.params.id;
        if(!req.userId) return res.json({message : 'Unauthenticated!'});
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
        const post = await PostMessage.findById(id);
        const index = post.likes.findIndex((id) => id === (req.userId))
        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((id) => id !== (req.userId));
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
        res.status(200).json(updatedPost);
    }
    catch(error){
        res.status(400).json(error.message); 
    }
}
exports.comment = async (req,res) => {
    const uid = req.userId
    const pid  = req.params.id;
    const value  = req.body.value;
    const post = await PostMessage.findById(pid);
    post.comments.push({body : value , uid : uid });
    const updatedPost = await PostMessage.findByIdAndUpdate(pid, post, { new: true });
    res.json(updatedPost);
}
exports.recentC = async (req,res) => {
    const uid = req.userId
    let comLog = []
    let likeLog = []
    const posts = await PostMessage.find()
    for (let i = 0; i< posts.length; i++) {
        for (let j = 0; j < posts[i]["comments"].length; j++) {
            if (posts[i]["comments"][j]["uid"] === uid) {
                comLog.push(posts[i])
            }
        }
       }
    for (let i = 0; i< posts.length; i++) {
        for (let j = 0; j < posts[i]["likes"].length; j++) {
            if (posts[i]["likes"][j] === uid) {
                likeLog.push(posts[i])
            }
        }
       }
    res.status(200).json({ recentComments: comLog , recentLikes: likeLog })
}

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}
