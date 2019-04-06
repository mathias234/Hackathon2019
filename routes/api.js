var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

router.get('/hentHandlekurv', function (req, res, next) {
    res.send(JSON.stringify(req.session.handlekurv));
});

router.get('/getPizza/:id', function (req, res, next) {
    sqlCon.query('SELECT * FROM pizza WHERE id=?', [req.params.id], function (err, result, fields) {
        if (req.session.handlekurv == undefined)
            req.session.handlekurv = [];

        req.session.handlekurv.push(result[0]);

        res.send(JSON.stringify(result));
    });
});

module.exports = router;
