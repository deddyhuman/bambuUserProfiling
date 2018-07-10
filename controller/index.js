var express = require('express');
var router = express.Router();

/**
 * Default router home page
 */
router.get('/', function(req, res, next) {
    return res.status(200).send('Welcome to bambu API v1.0.0')
});

module.exports = router;