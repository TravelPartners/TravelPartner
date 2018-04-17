'use strict'

const router = require('express').Router();

router.get('/TransSearch', (req,res,next)=>{

  let Trans = req.app.locals.db.model('Trans');

  Trans.findOne({ 'name': 'Scene1' }, function (err, trans) {
    if (err){
      console.log(err);
      res.json(err);

    }
    else{
      console.log(trans);
      //res.json(trans);
      res.render('trans/home');
    }
  });

});


module.exports = router;
