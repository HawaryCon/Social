const express = require('express');
const posts = require('../controllers/posts.js')
const auth = require('../middlewares/auth.js')
const user = require('../controllers/user.js')
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

const router = express.Router();


router.get('/', (req, res) => {
    res.status(201).json("Hell to the liars");
})

router.patch('/updateProfile', auth.auth, upload.single('pic'), user.updateProfile);

router.post('/createPost', auth.auth, upload.single('file') , posts.createPost);
router.get('/getPost/:id', posts.getPost);
router.get('/homePage', auth.auth , posts.homePage);

router.get('/myProfile', auth.auth, posts.myProfile);
router.get('/getProfile/:id', auth.auth, posts.getProfile);



router.patch('/likePost/:id',auth.auth, posts.likePost);
router.patch('/comment/:id', auth.auth, posts.comment);
router.patch('/updatePost/:id', auth.auth, upload.single('file'), posts.updatePost);
router.delete('/delPost/:id', auth.auth, posts.deletePost);

router.get('/recentC', auth.auth, posts.recentC);

module.exports = router;




