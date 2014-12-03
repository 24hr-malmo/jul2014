var express = require('express');
var router = express.Router();

// Lets a user join a course
router.get('/', function(req, res) {

    res.render("index", { layout: false });

});

module.exports = router;
