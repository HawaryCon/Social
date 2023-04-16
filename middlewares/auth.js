const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require('dotenv');
config();
exports.auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        let decodedData;
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }
        else{
            decodedData = jwt.verify(token, process.env.SECRET);

            req.userId = decodedData?.id;
        }

        next();
    } catch (error) {
        console.log(error.message);
    }
};