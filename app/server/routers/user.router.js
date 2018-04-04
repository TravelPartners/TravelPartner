'use strict'

const router = require('express').Router();

router.get('/profile/:name', (req, res, next) => {
    let name = req.params.name;

    res.json({ data: name });
});

module.exports = router;
