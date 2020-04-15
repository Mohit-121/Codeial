const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            },function(err,comment){
                if(err){console.log('error in adding comments');return;}
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            });
        }
    })
}

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(err){console.log('Error in finding comment'); return;}
        if(comment.user == req.user.id){
            Post.findByIdAndUpdate(comment.post,{$pull: {comments: req.params.id}},function(err,post){
                comment.remove();
                return res.redirect('back');
            });
        }
        else res.redirect('back');
    });
}