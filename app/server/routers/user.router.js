'use strict';

const bcrypt = require('bcrypt');

const router = require('express').Router();

const recommendation = require('../lib/recommendation');

/**
 *  Router get /u/profile/:name
 *
 *  Receive parameter user name
 *  Render file user/profile
 *
 *  Render user profle page.
 *
 */
router.get('/profile/:name', (req, res, next) => {
    let name = req.params.name;
    let results = {};

    let User = req.app.locals.db.model('User');

    // Get user whose name equals to variable 'name'.
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

            // Get user's preferred places.
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

            // Render user/profile page content.
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

/**
 *  Router post /u/recommendation/:name
 *
 *  Receive parameter user name
 *  Send JSON format string to client
 *
 *  Send recommended partners/places to user.
 *
 */

router.post('/recommendation/:name', (req, res, next) => {
    let name = req.params.name;
    let results = {};

    let User = req.app.locals.db.model('User');

    // Check user authority.
    req.app.locals.auth(req.app.locals.token, name)
        .then((username) => {
            if (name != username) {
                return Promise.reject('403');
            } else{
                return Promise.resolve(username);
            }
        })
        .then((username) => {
            // Get user whose name equals to variabl 'name'.
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
            // Get recommended partners.
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
            // Get recommended places.
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

            // Send success information to user.
            res.json({
                status: 'success',
                data: {
                    results: results
                }
            });
        })
        .catch((err) => {
            // Send error messages to user.
            res.json({
                status: 'err'
            });

            next(err);
        });
    
});

/**
 *  Router post /u/changepwd
 *
 *  Receive user post data
 *  Send JSON format string to user
 *
 *  Used to change password.
 *
 */

router.post('/changepwd', async (req, res, next) => {
    let username = req.body.username;
    if (username == undefined || username == '') {
        res.sendStatus(403);
    }

    try {
        // Check user authority
        username = await req.app.locals.auth(req.app.locals.token, username);

        // Check oldpwd field.
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
                        // Compare oldpwd with user's password in database
                        const result = await bcrypt.compare(oldpwd, users[0].pwd);

                        // Validations on user input.
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
                                // Update user password.
                                user = await User.where('name').equals(username).update({ $set: { pwd: newpwd }}).exec();
                                // Send success information to user.
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
