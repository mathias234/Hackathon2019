var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('omoss',
        {
            isAdmin: req.session.isAdmin,
        });
});

module.exports = router;
