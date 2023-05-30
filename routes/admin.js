const express = require('express');
const auth = require('../middlewares/auth.js')
const admin = require('../controllers/admin.js')
const router = express.Router();

router.get('/stat', auth.auth, admin.stat);

module.exports = router;