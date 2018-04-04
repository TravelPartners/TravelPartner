'use strict'

const router = require('express').Router();

//router.use((req, res, next) => { next(); });

router.get('/info', (req, res, next) => {
    res.json({ data: 456 });
});

router.post('/signup', (req, res, next) => {

});

router.post('/signin', (req, res, next) => {
    let User = req.app.locals.db.connection.model('User');
    let content = req.body;

    User
        .find()
        .exec()
        .then((res) => {
            console.log(res);
        }, (rej) => {
            console.log(rej);
        });    
});

router.post('/logout', (req, res, next) => {
    
});

module.exports = router;
