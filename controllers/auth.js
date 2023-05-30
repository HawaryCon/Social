const User = require('../models/user.js')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('../utils/nodemailer.js');
const { config } = require('dotenv');
config();

exports.signUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const token = jwt.sign({ email: email , role: "user" }, process.env.SECRET, { expiresIn: "1h" });
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, confirmationCode : token , id : String(Date.now()) });

        nodemailer.sendConfirmationEmail(
            result.name,
            result.email,
            token
        );
        
        res.status(201).json({message : "User was registered successfully! Please check your email" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
    
}
exports.verifyUser = async (req, res, next) => {
    try {
        const registeredUser = await User.findOne({ confirmationCode: req.params.confirmationCode });
        if (!registeredUser) return res.status(404).send({ message: "User Not found." });
        await User.findOneAndUpdate({ confirmationCode: req.params.confirmationCode }, { status: "Active" })
        res.status(200).send({ message: "You are verified user!"  });
    }
    catch{
        res.status(409).json({ message: error.message });
    }

}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        const role = oldUser["role"]
        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        if (oldUser.status != "Active") {
            return res.status(401).send({
                message: "Pending Account. Please Verify Your Email!",
            });
        }
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id , role : role }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ result: oldUser, token });
    } 
    catch (error) {
        res.status(409).json({ message: error.message });
    }
}