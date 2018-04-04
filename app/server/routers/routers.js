'use strict'

const router = require('express').Router();

router.use('/s', require('./site.router'));
router.use('/u', require('./user.router'));

module.exports = router;
