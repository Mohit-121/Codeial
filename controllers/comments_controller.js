const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            res.redirect('/');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let post = await Post.findByIdAndUpdate(comment.post,{$pull: {comments: req.params.id}});
            comment.remove();
            return res.redirect('back');
        }
        else res.redirect('back');
    }catch(err){
        console.log("Error",err);
        return;
    }
}