var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

function getPizza(callback) {
    sqlCon.query('SELECT * FROM Pizza', function (err, results, fields) {
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
            });
    });
});

module.exports = router;