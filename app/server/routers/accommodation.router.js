'use strict'

const router = require('express').Router();

router.get('/accoSearch',(req, res, next)=>{

  let Acco = req.app.locals.db.model('Acco');
  Acco.findOne({ 'name': 'TestHotel' }, function (err, acco) {
  if (err){
  console.log(err);
  res.json(err);

}
else{
  console.log(acco);
  //res.json(acco);
  res.render('acco/home');
}

  });

});

module.exports = router;
