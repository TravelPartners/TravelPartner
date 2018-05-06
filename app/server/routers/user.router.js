'use strict';

const bcrypt = require('bcrypt');

const router = require('express').Router();

const recommendation = require('../lib/recommendation');

router.get('/profile/:name', (req, res, next) => {
    let name = req.params.name;
    let results = {};

    let User = req.app.locals.db.model('User');

    User
        .where('name')
        .equals(name)
        .then((userList) => {
            if (userList.length <= 0) {
                return Promise.reject(new Error('nouser'));
            } else {
                results["user"] = userList[0];
                return Promise.resolve(results);
            }
        })
        .then(async (result) => {
            let placeId = results.user.locations;
            let placeModel = req.app.locals.db.model('Place');

            try {
                let places = await placeModel.where('_id').in(placeId).exec();
                let placesInResults = [];

                for (let each of places) {
                    placesInResults.push({
                        name: each.name,
                        url: '/p/' + each.name + '-' + each._id
                    });
                }

                results.locations = placesInResults;
                return Promise.resolve(results);
            } catch (err) {
                return Promise.reject(err);
            }
        })
        .then((result) => {
            console.log(results);

            if(results.user.phone == "") results.user.phone = "Empty Now";
            results.user.profileUrl = `/u/profile/${results.user.name}`;

            res.render('user/profile', {
                'user': results.user,
                'places': results.locations
            });
        })
        .catch((err) => {
            next(err);
        });

//    console.log(userPlaceRank);
//    res.json({ data: userPlaceRank });
});

router.post('/recommendation/:name', (req, res, next) => {
    let name = req.params.name;
    let results = {};

    let User = req.app.locals.db.model('User');

    req.app.locals.auth(req.app.locals.token, name)
        .then((username) => {
            if (name != username) {
                return Promise.reject('403');
            } else{
                return Promise.resolve(username);
            }
        })
        .then((username) => {
            return User
                .where('name')
                .equals(name)
                .then((userList) => {
                    if (userList.length <= 0) {
                        return Promise.reject(new Error('nouser'));
                    } else {
                        results["user"] = userList[0];
                        return Promise.resolve(results);
                    }
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        })
        .then((result) => {
            return recommendation
                .userUserMatch(name, req.app.locals.db.model('User'))
                .then((users) => {
                    for (let i=0;i < users.length; i++) {
                        (users[i]).url = '/u/profile/' + users[i].name;
                    }

                    result["users"] = users
                        .filter((user) => {
                            return (user.prop > 0.3) && (user.name != result.user.name);
                        })
                        .sort((l, r) => {
                            return parseFloat(r.prop) - parseFloat(l.prop);
                        })
                        .slice(0, 5);

                    return Promise.resolve(results);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        })
        .then((result) => {
            return recommendation
                .userPlaceMatch(
                    name,
                    req.app.locals.db.model('User'),
                    req.app.locals.db.model('Place'))
                .then((places) => {
                    results["places"] = places
                        .filter((place) => {
                            let arr = result.user.locations;
                            let f = true;

                            for (let a of arr) {
                                if (place.id == a.toString()) {
                                    f = false;
                                    break;
                                }
                            }

                            return f && (place.prop > 0.3);
                        })
                        .sort((l, r) => {
                            return parseFloat(r.prop) - parseFloat(l.prop);
                        })
                        .slice(0, 5);

                    return Promise.resolve(results);
                }).catch((err) => {
                    return Promise.reject(err);
                });
        })
        .then((result) => {
            console.log(results);

            results.user.profileUrl = `/u/profile/${results.user.name}`;

            res.json({
                status: 'success',
                data: {
                    results: results
                }
            });
        })
        .catch((err) => {
            res.json({
                status: 'err'
            });

            next(err);
        });
    
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
