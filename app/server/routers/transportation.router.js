'use strict'

const router = require('express').Router();

router.get('/TransSearch', (req,res,next)=>{

  let Trans = req.app.locals.db.model('Trans');

  Trans.findOne()
          .exec()
          .then((trans) => {
              let transname = acco.name;

              return Trans.find({ 'name': transname})
                  .then((transs) => {
                      let ret = [];
                      for (let Trans of transs) {
                          ret.push({
                              image_source:Trans.img,
                              name: Trans.name
                          });
                      }
                      return ret;
                  });
          }).then((transs) => {
              console.log(transs);
              res.render('trans/home', { trans: trans });
          })
          .catch((err) => {
              console.log(err);
              res.sendStatus(500);
          });

});


module.exports = router;
