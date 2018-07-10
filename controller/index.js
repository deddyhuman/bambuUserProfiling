var express = require('express');
var router = express.Router();

/**
 * Default router home page
 */
router.get('/', function(req, res, next) {
    return res.status(500).json({
        data: 'welcome'
    });
});

module.exports = router;