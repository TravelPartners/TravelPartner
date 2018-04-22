'use strict';

const router = require('express').Router();

router.get('/:place', (req, res, next) => {
    console.log(req.params);
    let placeInfo = req.params.place.split('-');
    let placeName = placeInfo[0];
    let placeId = placeInfo[1];

    console.log('welcome');

});

module.exports = router;
