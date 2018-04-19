'use strict'

const router = require('express').Router();

router.get("/",function(req, res, next) {
    let COMMENT = req.app.locals.db.model('Comment');
    let summary = [];
    COMMENT.find({}, function(err, allResult){
        if(err){
            console.log(err);
        }else{
            // res.render(title.handlebar);
            console.log(allResult);
            // Store a brief summary in summary
     		let ret = [];
     		for (let result of allResult) {
     			console.log(summary);
     			ret.push(
            {
     				title: result.title,
     				author: result.author,
     				commentBody: result.commentBody,
     				//reply: result.reply,
     				keyword: result.keyword,
     				url: '/c/' + result.title.split(' ').join('-'),
     				modified_at: result.modified_at,
            votes: result.votes.length,
            views: result.views
     			}  
        )
     		}
            res.render("Comment/comm", { comment: ret });
        }
    })
});


router.get("/: title",function(req, res, next) {
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
  let view= req.body.views;
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
