'use strict'

const bcrypt = require('bcrypt');
const router = require('express').Router();

//router.use((req, res, next) => { next(); });

router.get('/info', (req, res, next) => {
    res.json({ data: 456 });
});

router.post('/signup', (req, res, next) => {

});

router.post('/signin', (req, res, next) => {
    let User = req.app.locals.db.model('User');
    let content = req.body;

    User.find({ 'name': content.username })
        .exec()
        .then(async (users) => {
            return new Promise(async (resolve, reject) => {
                if (users.length > 0) {
                    await bcrypt.compare(content.password, users[0].pwd).then((result) => {
                        resolve(result);
                    }, (err) => {
                        reject(err);
                    });
                } else {
                    resolve(false);
                }
            });
        })
        .then((result) => {
            if (result == true) {
                res.json({ "data": { "status": "ok" }});
            } else {
                res.json({ "data": { "status": "fail", "msg": "Invalid username or password."}});
            }
        }, (err) => {
            res.sendStatus(500);
            console.log(err);
        });
});

router.post('/logout', (req, res, next) => {
    
});
module.exports = router;
