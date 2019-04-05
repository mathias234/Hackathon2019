var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('admin',
        {
            loggedIn: req.session.loggedIn,
            errorMsg: req.session.errorMsg,
        });
});

router.post('/login', function (req, res, next) {
    sqlCon.query('select * from brukere where brukernavn=?', [req.body.brukernavn], function (err, result, fields) {
        if (err) throw err;

        if (result.length == 0) {
            req.session.errorMsg = "Wrong username";
        }
        else if (req.body.passord == result[0].passord) {
            req.session.loggedIn = true;
        }
        else {
            req.session.errorMsg = "Wrong password";
        }

        res.redirect('/admin');
    });
});

router.post('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    })
});

module.exports = router;