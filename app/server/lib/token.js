'use strict'

// KEY should be changed if it has been used several times!

const KEY = 'aNkq%6aJer9*z40tf7(gh_Kl36m2@Lt';

const jwt = require('jsonwebtoken');

function get(username, ttl = 43200000, key = KEY) {
    let created_at = Date.now();

    return new Promise((resolve, reject) => {
        jwt.sign({ u:username, iat: created_at, exp: created_at + ttl }, key, (err, token) => {
            if (err)
                reject(err);
            else
                resolve(token);
        });
    });
};

function check(token, username, key = KEY) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, key, (err, decoded) => {
            if (err)
                reject(err);
            else
                resolve(decoded);
        });
    });
};

function info(token, username, key = KEY) {
    return jwt.decode(token);
};

module.exports.get = get;
module.exports.check = check;
module.exports.info = info;

module.exports.auth = (async (token, username) => {
    try {
        const decoded = await check(token, username);
        return Promise.resolve(decoded);
    } catch (err) {
        return Promise.reject(err);
    }
});
