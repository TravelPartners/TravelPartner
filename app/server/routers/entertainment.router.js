'use strict'

const router = require('express').Router();

router.get('/:place',(req, res, next)=>{
  let Place = req.app.locals.db.model('Place');
  let Spot = req.app.locals.db.model('Spot');

  let place = req.params.place.split('-');
  let placeName = place[0];
  let placeId = place[1];

  Place.findById(placeId, function(err, place){
    if (!err){
      let spots = place.spots;

      Spot.find({'_id': {$in: spots }}).exec(function(err, result1){
        console.log(result1);
        let top = [];
        let regular =[];
        for (let result of result1){
          top.push({
            img : result.imag,
            url : '/c/./' + result.name + '-' + result._id,
            title: result.titel,
            details: result.details,
            ticketInfo: result.ticketInfo,

          })
        };
        Spot.find({'_id':{$in: spots}}).exec(function(err,result2){
          for (let result of result2){
            regular.push({
              img : result.imag,
              url : '/c/./' + result.name + '-' + result._id,
              title: result.titel,
              details: result.details,
              ticketInfo: result.ticketInfo,

            })
          };

        });


      });
//1st
    }

  });


});
module.exports = router;
