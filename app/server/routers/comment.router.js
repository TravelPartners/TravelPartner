'use strict'

const router = require('express').Router();
//---------------------------------------------------------------------
router.get("/comment/: title",function(req, res, next) {
    let COMMENT = req.app.locals.db.model('Comment');

    let title = req.params.title.split('-');
    let titleName = title[0];
    let titleId = title[1];

    COMMENT.findOne({'title': titleName }, function(err, result){
        if(err){
            console.log(err);
        }else{

            console.log(result);

     		let reply = [];
     		for (let item of result) {

     			reply.push({
     				title: item.title,
     				author: item.author,
     				commentBody: item.commentBody,
     				reply: item.reply,
            keyword:item.keyword,
            votes: item.votes,
            view:item.views,
            modified_at:item.modified_at

     			})

     		}
            res.render("", { commentSpec: reply});
        }
    })
});
//---------------------------------------------------------------------
router.post("/newComment", function(req, res, next){
	let COMMENT = req.app.locals.db.model('Comment');
	let title = req.body.title;
	let author = req.body.author;
	let commentBody = req.body.commentBody;
	let keyword = req.body.keyword;
  let votes = req.body.votes;
  let view: req.body.views;
  let modified_at = req.body.modified_at;
	let Comment1 = {title: title, author: author, commentBody: commentBody, keyword:keyword, votes:votes, view:view, modified_at:modified_at};
	// Create a new Guide to the DB
	COMMENT.create(comment1, function(err, coment1){
		if(err){
			console.log(err);
			res.json({
			    status: 'error',
			});
		}else{

		    res.json({
		      status: 'succeess',
		      url: '/' + comment1.title.split(' ').join('-')
		    });
		}
	})
});


module.exports = router;
