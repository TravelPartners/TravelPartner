'use strict'

const router = require('express').Router();


router.get("/",function(req, res, next) {
    let Guide = req.app.locals.db.model('Guide');
    let summary = [];
    Guide.find({}, function(err, allResult){
        if(err){
            console.log(err);
        }else{
            // res.render(title.handlebar);
            console.log(allResult);
            // Store a brief summary in summary
     		let ret = [];
     		for (let result of allResult) {
     			console.log(summary);
     			ret.push({
     				title: result.title,
     				image: result.image[0],
     				user: result.user,
     				tags: result.tags,
     				summary: result.content.substr(0,20),
     				url: '/g/' + result.title.split(' ').join('-'),
     				updated_at: result.updated_at
     			})

     		}
            res.render("TG/tg", { guide: ret });
        }
    })
})

router.post("/new", function(req, res, next){
	let Guide = req.app.locals.db.model('Guide');	
	let title = req.body.title;
	let user = req.body.user;
	let tags = req.body.tags;
	let content = req.body.content;
	let image = req.body.image;
	let banner = req.body.image[0];
	let newGuide = {title: title, user: user, tags: tags, content: content, image: image, banner: banner};
	// Create a new Guide to the DB
	Guide.create(newGuide, function(err, newGuide){
		if(err){
			console.log(err);
			res.json({
			    status: 'error',
			 //   err: [
			 //     { name: xxx, msg: xxx },    
			 //   ]
			});
		}else{
		    //let ret = {};
		    res.json({
		      status: 'succeess',
		      url: '/' + newGuide.title.split(' ').join('-')
		    });
		}
	})
});


router.get('/:title', function(req, res, next) {
    let Guide = req.app.locals.db.model('Guide');
    let title = req.params.title.split("-").join(" ");

    Guide.find({"title": title}, function(err, result){
        if(err){
            console.log(err);
        }else{
            // res.render(title.handlebar);
            console.log(result);
        }
        res.render("TG/specificGuide", {result: result});
    })
    
    // console.log(location);
    // res.json({location: location});
});





module.exports = router;
