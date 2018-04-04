'use strict'

const mongoose = require('mongoose');

const config = require('../config');

const database = ((config) => {
    let c = config.database[process.env.NODE_ENV];
    let db = c.db || 'test',
        port = c.port || '27017',
        host = c.host.join(`:${port},`) || 'localhost',
        user = c.user || '',
        pwd = c.pwd || '',
        extra = c.extra || '';

    return {
        "db": db, "port": port, "host": host,
        "user": user, "pwd": pwd, "extra": extra
    };
})(config);

const dbConnection = ((db) => {
    let userString = '';
    if (db.user != '' && db.pwd != '')
        userString = `${db.user}:${db.pwd}@`;
    
    let connection = `mongodb://${userString}${db.host}:${db.port}/${db.db}`;
    if (db.extra != '')
        connection += `?${db.extra}`;

    return mongoose.connect(connection);
})(database);

dbConnection.then((res) => {
    console.log('Database connected...');

    let User = require('../data/user');
    let admin = new User({
        name: 'hyperadmin',
        pwd: 'hyperadmin123',
        email: 'siteadmin@siteadmin.com'
    });

    admin.save().then((user) => {
        console.log('User added.');
        //console.log(user);
        mongoose.disconnect();
    }, (err) => {
        console.log(err);
    });

}, (err) => {
    console.log('Cannot connect to the database...');
})
