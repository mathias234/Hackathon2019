var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index',
        {
        });
});

module.exports = router;