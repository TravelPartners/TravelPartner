'use strict';

const bcrypt = require('bcrypt');

const router = require('express').Router();

router.get('/profile/:name', (req, res, next) => {
    let name = req.params.name;

    res.json({ data: name });
});

router.post('/changepwd', async (req, res, next) => {
    let username = req.body.username;
    if (username == undefined || username == '') {
        res.sendStatus(403);
    }

    try {
        username = await req.app.locals.auth(req.app.locals.token, username);

        let oldpwd = req.body.oldpwd;
        if (oldpwd == undefined || oldpwd == '') {
            res.json({
                status: 'err',
                error: {
                    type: 'oldpwd',
                    msg: 'Old password cannot be blank.'
                }
            });
        }

        let User = req.app.locals.db.model('User');
        User
            .where('name').equals(username)
            .exec()
            .then(async (users) => {
                if (users.length > 0) {
                    try {
                        //console.log(oldpwd);
                        //console.log(users[0].pwd);
                        const result = await bcrypt.compare(oldpwd, users[0].pwd);
                        //const result = true;

                        if (result == true) {
                            let newpwd = req.body.newpwd;
                            let retypedpwd = req.body.retypedpwd;

                            if (newpwd == undefined || newpwd == '') {
                                res.json({
                                    status: 'err',
                                    error: {
                                        type: 'newpwd',
                                        msg: 'New password cannot be blank.'
                                    }
                                });
                            }

                            if (retypedpwd == undefined || retypedpwd == '') {
                                res.json({
                                    status: 'err',
                                    error: {
                                        type: 'retypedpwd',
                                        msg: 'Retyped password cannot be blank.'
                                    }
                                });
                            }

                            if (newpwd != retypedpwd) {
                                res.json({
                                    status: 'err',
                                    error: {
                                        type: 'equal',
                                        msg: 'Retyped password did not match the new password.'
                                    }
                                });
                            }

                            let user = users[0];
                            user.pwd = newpwd;

                            try {
                                //console.log(user);
                                user = await User.where('name').equals(username).update({ $set: { pwd: newpwd }}).exec();
                                res.json({
                                    status: 'success'
                                });
                                return user;
                            } catch (err) {
                                return Promise.reject(err);
                            }

                        } else {
                            res.sendStatus(403);
                        }
                    } catch (err) {
                        return Promise.reject(err);
                    }
                } else {
                    res.sendStatus(403);
                }
            })
            .then((res) => {})
            .catch((err) => {
                console.log(err);
                next(err);
            });
    } catch (err) {
        console.log(err);
        res.sendStatus(403);
    }

});

module.exports = router;
