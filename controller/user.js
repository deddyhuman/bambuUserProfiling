var express = require('express');
var router = express.Router();
var userSchema = require('../model/userSchema.js'),
    userModel = new userSchema();

router.post('/register', function (req, res, next) {
    return res.status(200).json({
        profile_type: ""
    });
});

module.exports = router;