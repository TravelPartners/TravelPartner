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

    let Guide = require('../data/guide');
    let init_guid = new Guide({
        title: 'First guide',
        user: 'hyperadmin',
        content: 'Test guide',
        votes: []
    });

    let Trans = require('../data/transportation');
    let init_trans = new Trans({
        name: 'Scene1',
        desc: 'Test trans'
    });

    let Acco = require('../data/accommodation');
    let init_acco = new Acco({
        name: 'TestHotel',
        email: 'test@testhotel.com',
        phone: '(315)418-6030',
        votes: [],
        price: 100
    });

/*
    (async () => {
        try {
            let user = await admin.save();
            let guide = await init_guid.save();
            let trans = await init_trans.save();
            let acco = await init_acco.save();

            console.log('Initial records added');
        } catch (err) {
            console.log(err);
        } finally {
            mongoose.disconnect();
        }
    })();
*/

    Promise.all([admin.save(), init_guid.save(), init_trans.save(), init_acco.save()])
        .then((res) => {
            console.log('Records added.');
            mongoose.disconnect(); })
        .catch((err) => {
            console.log(err);
            mongoose.disconnect();
        });
}, (err) => {
    console.log('Cannot connect to the database...');
});
