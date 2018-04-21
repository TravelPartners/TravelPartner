'use strict';

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
        phone: '',
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

    let Site = require('../data/site');
    let init_site = new Site({
        title: 'Travel Advisor',
        keyword: 'travel advisor panorama'
    });

    let Location = require('../data/location');
    let init_location = new Location({
        name: 'Boston',
        desc: '',
        geo: {
            text: 'MA USA',
            lat: 42.358,
            lng: -71.061
        }
    });

    let Comment = require('../data/comment');
    let init_comment = new Comment({
        title: 'Test comment',
        author: 'hyperadmin',
        commentBody: 'Test comment content',
        reply: [{
            replier: 'hyperadmin',
            replyBody: 'testReply'
        }],
        votes: []
    });

    let Spot = require('../data/entertainment');
    let init_spot = new Spot({
        img: '',
        title: 'Test scene',
        details: {
            descrip: 'Test',
            when: '',
            where: 'Syracuse'
        },
        ticketInfo: {
            discount: '',
            link: ''
        }
    });

    let Food = require('../data/food');
    let init_food = new Food({
        image: [],
        name: 'Food1',
        descript: 'Food123',
        tags: [],
        restaurant: {
            isRes: false,
            location: '',
            email: '',
            phone: ''
        }
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

    Promise.all([admin.save(), init_guid.save(), init_trans.save(), init_acco.save(), init_site.save(), init_location.save(), init_comment.save(), init_spot.save(), init_food.save()])
        .then((res) => {
            console.log('Records added.');
            mongoose.disconnect(); })
        .catch((err) => {
            console.log(err);
            //mongoose.disconnect();
        });
}, (err) => {
    console.log('Cannot connect to the database...');
});
