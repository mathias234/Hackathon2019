var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

function getPizza(callback) {
    sqlCon.query('SELECT * FROM pizza', function (err, results, fields) {
        if (err) throw err;

        callback(results);
    });
}

/* GET home page. */
router.get('/', function (req, res, next) {
    getPizza(function (pizza) {
        res.render('bestill',
            {
                pizzaArray: pizza,
                isAdmin: req.session.isAdmin,
            });
    });
});

router.get('/betal', function (req, res, next) {
    res.render('betal', {
        isAdmin: req.session.isAdmin,
    });
});

router.post('/leggTilOrdre', function (req, res, next) {
    req.session.handlekurv.forEach(pizza => {
        sqlCon.query('INSERT INTO ordre(navn, telefonnr, email, pizzaId) VALUES(?,?,?,?)', [
            req.body.navn,
            req.body.telefonnr,
            req.body.email,
            pizza.id,

        ], function (err, results, fields) {
            if (err) throw err;

        });
    });

    req.session.handlekurv = undefined;
    res.render('takkforhandelen', {
        isAdmin: req.session.isAdmin
    });
});


module.exports = router;