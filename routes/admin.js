var express = require('express');
var router = express.Router();
var dbCon = require('../lib/db')

var sqlCon = dbCon.getDBConnection();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.loggedIn) {
        res.render('login', {
            errorMsg: req.session.errorMsg,
            isAdmin: req.session.isAdmin,
        });
    }
    else {
        // send brukeren til /admin/ordre siden
        res.redirect('/admin/ordre');
    }
});

// Hent ordre og pizza navn basert på ordre.pizzaid
function getOrders(callback) {
    sqlCon.query(
        "SELECT ordre.navn, ordre.id, ordre.telefonnr, ordre.email, ordre.hentet, ordre.ferdig, pizza.name AS 'pizzaname' " +
        "FROM ordre INNER JOIN pizza ON pizza.id = ordre.pizzaId",
        function (err, result, fields) {
            if (err) throw err;

            var data = [];

            result.forEach(res => {
                if (res.hentet == 0)
                    res.hentet = false;
                else
                    res.hentet = true;

                if (res.ferdig == 0)
                    res.ferdig = false;
                else
                    res.ferdig = true;

                data.push(res);
            });

            callback(data);
        });
}

router.get('/ordre', function (req, res, next) {
    getOrders(function (ordre) {
        res.render('ordre', {
            isAdmin: req.session.isAdmin,
            ordre: ordre,
        });
    });
});

router.post('/oppdaterordre', function (req, res, next) {
    console.log(req.body);

    var hentet = 0;
    if (req.body.hentet != undefined)
        hentet = 1;

    var ferdig = 0;
    if (req.body.ferdig != undefined)
        ferdig = 1;

    sqlCon.query('UPDATE ordre SET hentet=?, ferdig=? where id=?', [
        hentet,
        ferdig,
        req.body.id
    ], function (err) {
        if (err) throw err;

        res.redirect('/admin/ordre');
    });
});

// Hent alle pizzaene fra databasen
function getPizza(callback) {
    sqlCon.query('SELECT * FROM pizza', function (err, results, fields) {
        if (err) throw err;

        callback(results);
    });
}

router.get('/endreMeny', function (req, res, next) {
    getPizza(function (pizza) {
        res.render('endreMeny', {
            isAdmin: req.session.isAdmin,
            pizza: pizza,
        })
    });
});

router.post('/addpizza', function (req, res, next) {
    // Legg til en ny pizza type i databasen.
    sqlCon.query('insert into pizza(name, description, price) VALUES(?, ?, ?)',
        [req.body.pizzaNavn, req.body.pizzaBeskrivelse, req.body.pizzaPris],
        function (err, result, fields) {
            if (err) throw err;
            res.redirect('/admin/endreMeny');
        });
});

router.post('/slettpizza/:id', function (req, res, next) {
    // finn en bedre måte å gjøre dette på, tenk hvis en kunde har bestilt en pizza også blir typen slettet. 
    // Dette kan skape kaos..
    sqlCon.query('DELETE FROM ordre where pizzaId=?', [req.params.id], function (err, result, fields) {
        if (err) throw err;
        sqlCon.query('DELETE FROM pizza where id=?', [req.params.id], function (err, result, fields) {
            if (err) throw err;
            res.redirect('/admin/endreMeny');
        });
    });
});

/* Login del */
/* TODO: Passord hashing */

router.post('/login', function (req, res, next) {
    sqlCon.query('select * from brukere where brukernavn=?', [req.body.brukernavn], function (err, result, fields) {
        if (err) throw err;

        if (result.length == 0) {
            req.session.errorMsg = "Wrong username";
        }
        else if (req.body.passord == result[0].passord) {
            req.session.loggedIn = true;
            req.session.isAdmin = true;
        }
        else {
            req.session.errorMsg = "Wrong password";
        }

        res.redirect('/admin');
    });
});

// Sletter session din og sender deg tilbake til hovedsiden
router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    })
});

module.exports = router;