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

            comment = await Comment.findById(comment.id).populate({path:'user',select:'name'});
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Created!"
                });
            }

            // req.flash('success','Comment Published!');
            res.redirect('/');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            let post = await Post.findByIdAndUpdate(postId,{$pull: {comments: req.params.id}});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment: comment
                    },
                    message:"Comment deleted!"
                });
            }

            req.flash('success','Comment Deleted Successfully!');
            return res.redirect('back');
        }
        else{
            req.flash('error','You cannot delete this comment!');
            res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}