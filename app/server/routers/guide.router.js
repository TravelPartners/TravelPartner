'use strict'

const router = require('express').Router();

router.get('/:title', function(req, res, next) {
    let Guide = req.app.locals.db.model('Guide');
    let title = req.params.title.split("-").join(" ");

    Guide.find({"title": title}, function(err, title){
        if(err){
            console.log(err);
        }else{
            console.log(title);
        }
    })
    // console.log(location);
    // res.json({location: location});
});




module.exports = router;
