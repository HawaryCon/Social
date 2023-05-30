const express = require('express');
const user = require('../controllers/auth.js')
const router = express.Router();
router.post('/signUp', user.signUp);
router.post('/signIn', user.signIn);

router.get("/confirm/:confirmationCode", user.verifyUser)




module.exports = router;