'use strict'

const router = require('express').Router();


//url
router.get('/view/:hotel', function(req, res,next){
 let hotel = req.params.hotel.split('-');
 let hotelName = hotel[0];
 let hotelId = hotel[1];

 Acco.findById(hotelId, function(err, hotel) {
   if (!err) {
     console.log(hotelId);
     }

   })
 });


// location: "boston"-"_id"
router.get('/:place',(req, res, next)=>{
  let Place = req.app.locals.db.model('Place');
  let Acco = req.app.locals.db.model('Acco');

  let place = req.params.place.split('-');
  let placeName = place[0];
  let placeId = place[1];

  Place.findById(placeId, function(err, place) {
    if (!err) {
      let hotels = place.hotels;


    Acco.find({ '_id': { $in: hotels } }).sort({ 'price': '-1' }).limit(4).exec(function(err, accos) {
        console.log(accos);
          let cheap = [];
          let luxury = [];
          let romantic = [];
          let top = [];

          for (let acco of accos) {
            cheap.push({
              image_source: (acco.img)[0],
              //imgs: acco.img,
              url: '/a/view/' + acco.name + '-' + acco._id,
              name: acco.name,
              email: acco.email
            })
          };

      Acco.find({ '_id': { $in: hotels } }).sort({ 'price': '1' }).limit(4).exec(function(err, accos) {
              for (let acco of accos) {
                luxury.push({
                  image_source: (acco.img)[0],
                  url: '/a/view/' + acco.name + '-' + acco._id,
                  //imgs: acco.img,
                  name: acco.name,
                  email: acco.email
                })
              };

              Acco.find({ '_id': { $in: hotels }} ,{'tags': 'romantic'}).limit(4).exec(function(err, accos) {
                  //console.log(accos);
                  for (let acco of accos) {
                    romantic.push({
                      image_source: (acco.img)[0],
                      //imgs: acco.img,
                      url: '/a/view/' + acco.name + '-' + acco._id,
                      name: acco.name,
                      email: acco.email
                    })
                  };


                      res.render('acco/home', { TopHotel: cheap});

                    });
                  });
                });

     }
   });

  });

  module.exports = router;



         /*
        tophotel sort with votes


        Acco.aggregate([{'_id': { $in: hotels}}, { $unwind: "$votes" }, { $sortByCount: "$votes" }]).limit(1).exec(function(err, accos) {
            console.log(accos);
            for (let acco of accos) {
              top.push({
                image_source: (acco.img)[3],
                imgs: acco.img,
                name: acco.name,
                email: acco.email
                */
