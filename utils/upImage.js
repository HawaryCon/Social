
const { config } = require('dotenv');
config();
const fs = require('fs');
const ImageKit = require("imagekit")
const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})
module.exports.uploadFile = (file)=> {
    
        const data = fs.readFileSync(req.file.path);
        imageKit.upload({
            file: data,
            fileName: req.file.originalname,
            folder: 'images'
        }, function (error, result) {
            if (error) console.log(error);
            else console.log(result["url"]);
            
        });
    
}
